const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel');
const asyncHandler = require("express-async-handler")

const createUser = asyncHandler (async(req, res) =>{
    const email = req.body.email;
    const findUser = await User.findOne({email: email});
    if (!findUser){
        const newUser = await User.create(req.body);
        res.json(newUser);

    }else{
        throw new Error("User Already Exits");
    }
});


const loginUser = asyncHandler(async(req, res) =>{
    const {email, password} = req.body;
    const findUser = await User.findOne({email});
    if (findUser && await findUser.isPasswordMatched(password)){
    
        res.json({
            _id: findUser?._id,
            fullname: findUser?.fullname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        });

    }else{
        throw new Error("User doesn't Exits");
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
    try{
        const deleteUser = await User.findByIdAndDelete(id);
        res.json({
            deleteUser,
        });

    }catch(error){
        throw new Error(error);
    } 
});


const updateUser = asyncHandler(async(req, res)=>{
    const {id} = req.params;
    try{
        const updateUser = await User.findByIdAndUpdate(id, {
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
})

module.exports = {createUser, loginUser, getAllUser, getAUser, deleteUser, updateUser};