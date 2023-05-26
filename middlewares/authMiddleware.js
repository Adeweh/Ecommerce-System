const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');


const authMiddleware = asyncHandler(async(req, res, next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
        try{
            if(token){
                const decoded = jwt.verify(token, process.env.JWT_SECRET );
                const user = await User.findById(decoded.id);
                req.user = user;
                next();
            // }else{
            //     throw new Error("Token not found");
            }

        }catch(error){
        throw new Error("Token expired. Generate new Token!");
        }
    }else{
        throw new Error("No Token Attached");
    }
    });

    const isAdmin = asyncHandler(async(req, res, next) => {
        const {email} = req.user;
        const adminUser = await User.find ({email});
        if(adminUser || adminUser.role !== "admin"){
            throw new Error("Not an admin");
        }else{
            next();
        }
    });


    module.exports = {authMiddleware, isAdmin};