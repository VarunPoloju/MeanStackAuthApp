import User from "../Models/User.js";
import { createError } from "../Utils/error.js";
import { createSuccess } from "../Utils/success.js";

export const getAllUsers = async (req,res,next) =>{
    try {
        const users = await User.find();
        return next(createSuccess(200,'All users', users))
    } catch (error) {
        return next(createError(500, 'Internal server error!')); 
 
    }
}



export const getUserById = async (req,res,next) =>{
    try {
        const user = await User.findById(req.params.id);
        if(!user){
            return next(createError(404, 'User not found'))
        }
        return next(createSuccess(200, 'Single user',user))
    } catch (error) {
        return next(createError(500, 'Internal server error!')); 
    }
}