const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodb");


const createBlog = asyncHandler(async(req, res) => {
    try{
        const newBlog = await Blog.create(req.body);
        res.json(newBlog);
    }catch(error){
        throw new Error(error);
    }

});

const updateBlog = asyncHandler(async(req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {new:true});
        res.json(updateBlog);
    }catch(error){
        throw new Error(error);
    }

});

const getBlog = asyncHandler(async(req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const getBlog = await Blog.findById(id);
        await Blog.findByIdAndUpdate(id, {
            $inc: {numViews: 1},
        },
        {new: true});
        res.json(getBlog);
    }catch(error){ 
        throw new Error(error);
    }

});

const getAllBlog = asyncHandler(async(req, res) => {
    try{
        const getBlogs = await Blog.find();
        res.json(getBlogs);
    }catch(error){ 
        throw new Error(error);
    }

});



const deleteBlog = asyncHandler(async(req, res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const deletedBlog = await Blog.findByIdAndDelete(id);
        res.json(deletedBlog);
    }catch(error){
        throw new Error(error);
    }

});

const likeBlog = asyncHandler(async(req, res) => {
    const {blogId} = req.body;
    validateMongoDbId(blogId);

    const blog = await Blog.findById(blogId);

    const loginUserId = req?.user?._id;

    const isLiked = blog?.isLiked;

    const alreadyDisliked = blog?.dislikes?.find(
        (userId) => userId?.toString() === loginUserId?.toString())
    ;
    if(alreadyDisliked){
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: {dislikes: loginUserId},
                isDisliked: false,
            },
            {
            new: true
            }
        );
        res.json(blog);
    }
    if(isLiked){
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: {likes: loginUserId},
                isLiked: false,
            },
            {new: true}
        );
        res.json(blog);
    }else{
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: {likes: loginUserId},
                isLiked: true,
            },
            {new: true }
        );
        res.json(blog);
    } 
});


const dislikeBlog = asyncHandler(async(req, res) => {
    const {blogId} = req.body;
    validateMongoDbId(blogId);

    const blog = await Blog.findById(blogId);

    const loginUserId = req?.user?._id;

    const isLiked = blog?.isLiked;

    const alreadyDisliked = blog?.dislikes?.find(
        (userId) => userId?.toString() === loginUserId?.toString())
    ;
    if(alreadyDisliked){
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: {dislikes: loginUserId},
                isDisliked: false,
            },
            {
            new: true
            }
        );
        res.json(blog);
    }
    if(isLiked){
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $pull: {likes: loginUserId},
                isLiked: false,
            },
            {new: true}
        );
        res.json(blog);
    }else{
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $push: {likes: loginUserId},
                isLiked: true,
            },
            {new: true }
        );
        res.json(blog);
    } 
});

module.exports = {createBlog, updateBlog, getBlog, getAllBlog, deleteBlog, likeBlog, dislikeBlog}