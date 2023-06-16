
const User = require('../models/userModel');
const asyncHandler = require("express-async-handler");
const { generateToken } = require('../config/jwtToken');
const validateMongoDbId = require('../utils/validateMongodb');
const { generateRefreshToken } = require('../config/refreshToken');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const sendEmail = require('./emailController');



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


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
      const refreshToken = await generateRefreshToken(findUser?._id);
      await User.findByIdAndUpdate(findUser._id, { refreshToken }, { new: true });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
  
      res.json({
        _id: findUser._id,
        fullname: findUser.fullname,
        email: findUser.email,
        mobile: findUser.mobile,
        token: generateToken(findUser._id),
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  });


  const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const findAdmin = await User.findOne({ email });
    if(findAdmin.role !== "admin") throw new Error("Not an Admin");
    if (findAdmin && (await findUser.isPasswordMatched(password))) {
      const refreshToken = await generateRefreshToken(findAdmin?._id);
      await User.findByIdAndUpdate(findUser._id, { refreshToken }, { new: true });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });
  
      res.json({
        _id: findAdmin._id,
        fullname: findAdmin.fullname,
        email: findAdmin.email,
        mobile: findAdmin.mobile,
        token: generateToken(findAdmin._id),
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  });




const handleRefreshToken = asyncHandler(async(req, res) =>{
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
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

const logOut = asyncHandler(async(req, res) =>{
    const cookie = req.cookies;
    if(!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if(!user){
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.status(204);
    }
    await User.findOneAndUpdate({refreshToken}, {
        refreshToken: "", 
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204);

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

const saveAddress = asyncHandler(async(req, res, next) => {
    const {_id} = req.user;
    validateMongoDbId(_id);
    try{
        const updateUser = await User.findByIdAndUpdate(_id, {
            address: req?.body.address,
        },
        {
            new: true,
        });
        res.json(updateUser);
    }catch(error){
        throw new Error(error);
    }

})



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


const updatePassword = asyncHandler(async(req, res)=>{
    const { _id } = req.user;
    const { password } = req.body;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if(password){
        user.password = password;
        const updateUserPassword = await user.save();
        res.json(updateUserPassword);
    }else{
        res.json(user);
    }

});

const forgotPasswordToken = asyncHandler(async(req, res)=>{
    const {email} = req.body;
    const foundUser = await User.findOne({email});
    if(!foundUser) throw new Error("User not Found");
    try{
        const token = await foundUser.createPasswordResetToken();
        await foundUser.save();
        const resetURL = `Follow this link to reset your Password. Link valid for 10 minutes. <a href='http://localhost:5001/api/user/reset-password/${token}'>Click Here</a>`;
        const data ={
            to:email,
            text: "Welcome",
            subject: "Forgot Password Link",
            html: resetURL
        };
        sendEmail(data);
        res.json({token});


    }catch (error){
        throw new Error(error)
    }

});

const resetPassword = asyncHandler(async(req, res) =>{
    const {password} = req.body;
    const {token} = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {Sgt: Date.now()},
    });
    if(!user) throw new Error("Token Expired, Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires= undefined;
    await user.save();
    res.json(user);
});

const getWishlist = async(async(req, res)=> {
    const {_id} = req.user;
    try{
        const findUser = await User.findById(_id).populate("wishlist");
        res.json(findUser);

    }catch(error){
        throw new Error(error);
    }
})

module.exports = {createUser, loginUser, getAllUser, getAUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logOut, updatePassword, forgotPasswordToken, resetPassword, loginAdmin, getWishlist, saveAddress};