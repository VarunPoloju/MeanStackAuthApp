//this is used to verify the token created using JWT
// we are creating token when  login is successfull in  auth controller.js
import jwt from 'jsonwebtoken';
import { createError } from './error.js';

export const validateToken = (req,res,next) =>{
    //we are sening token in cookie so extact token from it
    const token = req.cookies.access_token;
    if(!token){ //if token is null
        return next(createError(401, 'You are not authenticated'))
    }
    //if token is there then verify
    jwt.verify(token, process.env.JWT_SECRET, (err, user) =>{
        if(err){
            return next(createError(403, 'Token is not valid'));
        }
        //if token valid i will attach userResponse to my request body 
        else{
            req.user = user;
        }
        next();
    });
}

export const verifyUser = (req,res,next) =>{
    validateToken(req,res, ()=>{
        //here checking if the user id is correct or not or if the person is user or admin
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        }
        else{
            return next(createError(403,'You are not authorized'));
        }
    })
}

export const verifyAdmin = (req,res,next) =>{
    validateToken(req,res, ()=>{
        //here checking if the user id is correct or not or if the person is user or admin
        if(req.user.isAdmin){
            next();
        }
        else{
            return next(createError(403,'You are not authorized'));
        }
    })
}