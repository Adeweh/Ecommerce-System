
const User = require('../models/userModel');
const asyncHandler = require("express-async-handler");
const { generateToken } = require('../config/jwtToken');
const validateMongoDbId = require('../utils/validateMongodb');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');


const createUser = asyncHandler (async(req, res) =>{
    const email = req.body.email;
    const findUser = await User.findOne({email: email});
    if (!findUser){
        const newUser = await User.create(req.body);
        res.json(newUser);

    }else{
        throw new Error("User Exits");
    }
});


const loginUser = asyncHandler(async(req, res) =>{
    const {email, password} = req.body;
    const findUser = await User.findOne({email});
    if (findUser && (await findUser.isPasswordMatched(password))){
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateUser = await User.findByIdAndUpdate(findUser.id, {
            refreshToken: refreshToken,
        }, {
            new: true
        });
        res.cookie("refreshToken", refreshToken,{
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,

        });
        
    
        res.json({
            _id: findUser?._id,
            fullname: findUser?.fullname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        });

    }else{
        throw new Error("Invalid Credentials");
    }
});


const handleRefreshToken = asyncHandler(async(req, res) =>{
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    console.log(refreshToken);
    const user = await User.findOne({refreshToken});
    if (!user) throw new Error("No Refresh token present in db");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) =>{
        if (err || user.id !== decoded.id){
            throw new Error("Something went wrong");
        }
        const accessToken = generateToken(user?._id)
        res.json({accessToken});   
    });

});


const updateUser = asyncHandler(async(req, res)=>{
    const {_id} = req.user;
    validateMongoDbId(_id);
    try{
        const updateUser = await User.findByIdAndUpdate(_id, {
            fullname: req?.body.fullname,
            email: req?.body.email,
            mobile: req?.body.mobile,
        },
        {
            new: true,
        });
        res.json(updateUser);
    }catch(error){
        throw new Error(error);
    }
});



const getAllUser = asyncHandler(async (req, res) =>{
    try{
        const getUsers = await User.find();
        res.json(getUsers);
    }catch(error){
        throw new Error(error);
    }
})


const getAUser = asyncHandler(async(req, res)=> {
    const{id}= req.params;
    validateMongoDbId(id);
    try{
        const getUser = await User.findById(id);
        res.json({
            getUser,
        });

    }catch(error){
        throw new Error(error);
    } 
});

const deleteUser = asyncHandler(async(req, res)=> {
    const{id}= req.params;
    validateMongoDbId(id);
    try{
        const deleteUser = await User.findByIdAndDelete(id);
        res.json({
            deleteUser,
        });

    }catch(error){
        throw new Error(error);
    } 
});



const blockUser = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const block = await User.findByIdAndUpdate(id, {
            isBlocked: true,
    },{
        new: true
    });
    res.json(block);
}catch (error){
    throw new Error(error);

}       

});

const unblockUser = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const unblock = await User.findByIdAndUpdate(id, {
            isBlocked: false,
    },{
        new: true
    });
    res.json({
        message: "User Unblocked",
    });
}catch (error){
    throw new Error(error);

}       
});

module.exports = {createUser, loginUser, getAllUser, getAUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken};