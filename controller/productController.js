const Product = require("../models/productModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");


const createProduct = asyncHandler(async (req, res)=> {
   try{
    if(req.body.title){
        req.body.slug=slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);

   }catch (error){
    throw new Error(error);
   }
}); 

const updateProduct = asyncHandler(async(req, res)=>{
    const id = req.params.id;
    try{
        if(req.body.title){
            req.body.slug=slugify(req.body.title);
        }
        const updateProduct = await Product.findOneAndUpdate({_id: id}, req.body,
        {
            new: true,
        });
        res.json(updateProduct);
    }catch(error){
        throw new Error(error);
    }
});

const deleteProduct = asyncHandler(async(req, res)=>{
    const id = req.params.id;
    try{
        if(req.body.title){
            req.body.slug=slugify(req.body.title);
        }
        const findProduct = await Product.findById({_id: id});
        res.json(findProduct);
    }catch(error){
        throw new Error(error);
    }
});

const getAProduct = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    try{
        const findProduct = await Product.findById(id);
        res.json(findProduct);

    }catch (error){
    throw new Error(error);
}});

const getAllProduct = asyncHandler(async(req, res)=> {

    try{
        //Filtering
        const queryObject = {...req.query};
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((item) => delete queryObject[item]);
        console.log(queryObject);
        let queryString = JSON.stringify(queryObject);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match)=> `$${match}`);
        let query = Product.find(JSON.parse(queryString));

        //Sorting

        if(req.query.sort){
            const sortBy = req.query.sort.split(",").json(" ");
            query = query.sort(sortBy);
        }else{
            query = query.sort("-createdAt");
        }

        //Limiting Fields

        if(req.query.fields){
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields);
        }else{
            query = query.select("-__v");
        }

        //page  

        const page = parseInt( req.query.page) || 1;
        const limit = parseInt( req.query.page) || 10;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);

        if(req.query.page){
            const productCount = await Product.countDocuments();
            if(skip >= productCount) throw new Error("Page does not exists");
        }        
        
        const products = await query;
        res.json(products);
       
    }catch (error){
    throw new Error(error);

}});

const addToWishList = asyncHandler(async(req, res)=> {
    const {_id} = req.user;
    const {prodId} = req.body;

    try{
        const user = await User.findById(_id);
        const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);

        if (alreadyadded){
            let user = await User.findByIdAndUpdate(
                _id,{
                    $pull: {wishlist: prodId},
                },
                {
                    new: true,
                }
            );
            res.json(user);
        }else{
            let user = await User.findByIdAndUpdate(
                _id,{
                    $push: {wishlist: prodId},
                },
                {
                    new: true,
                }
            );
            res.json(user);

        }
        }catch(error){
            throw new Error(error);
        }
    });

const rating = asyncHandler(async (req, res) => {
    const {_id} = req.user;
    const {star, prodId, comment} = req.body;
    try{
        const product = await Product.findById(prodId);
        let alreadyRated = product.ratings.find(
            (userId) => userId.postedby.toString() === _id.toString()
        );
        if(alreadyRated){
            const updateRating = await Product.updateOne(
                {
                    ratings: {$elemMatch: alreadyRated},
                },
                {
                    $set: {"ratings.$.star": star, "ratings.$.comment": comment},

                },
                {
                        new: true,
                });
                    res.json(updateRating);
    } else{
        const rateProduct = await Product.findByIdAndUpdate(
             prodId, 
            {
                $push: {
                     ratings:{
                         star: star,
                         comment: comment,
                         postedby: _id,
                        },
                    },
            },{new: true,});
        }
        const getallratings = await Product.findById(prodId);
        let totalRating = getallratings.ratings.length;
        let ratingsum = getallratings.ratings
            .map((item) => item.star)
            .reduce((prev, curr)=> prev + curr, 0);
        let actualRating = Math.round(ratingsum / totalRating);
        let finalproduct = await Product.findByIdAndUpdate(
            prodId,
            {
                totalRating: actualRating,
            },
            {new:true}
        );
        res.json(finalproduct);

    }   catch(error) {
        throw new Error(error);
    }
        
 });





module.exports = {createProduct, getAProduct, getAllProduct, updateProduct, deleteProduct, addToWishList, rating};