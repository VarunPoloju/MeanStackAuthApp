import  Role  from '../Models/Role.js';
import User from '../Models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createError } from './../Utils/error.js';
import { createSuccess } from './../Utils/success.js';

export const register = async (req,res,next) => {
    try {
        const role = await Role.find({role : 'User'});  //User is already created so we are , finding the user role
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            username : req.body.username,
            email : req.body.email,
            password : hashPassword,
            roles : role    //here by default who ever is registering we are making them as User role so that's why we find and binding it to the roles
            // in postman or via ui we dont pass role in req.body.role here only we are adding it
        });
        await newUser.save();
        return next(createSuccess(200,'User Registered successfully'));
    } catch (error) {
        // return res.status(500).send('Something went wrong!');
        return next(createError(500, 'Internal server error!')); //u can use abobve approach also but this is meaningful
    }
}


export const login = async(req,res,next) =>{
    try {
        const user = await User.findOne({email : req.body.email}).populate("roles","role"); //populate is from mogoose roles - path, in that u need role  :
        const {roles} = user;   //in user we have roles so we are destructuring and passing below
        if(!user){
            // return res.status(404).send('User not found!');
            return next(createError(400,'User not found!'));
        }
       const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
       if(!isPasswordCorrect){
        // return res.status(400).send('Password incorrect!');
        return next(createError(400,'Password incorrect!'));
       }
       const token = jwt.sign(
        {  id : user._id, isAdmin : user.isAdmin, roles : roles},   //to get the  :roles here we need to populate above,,,, all these are passing in the payload of JWT token, 
        process.env.JWT_SECRET  //using these 2 we are creating token for particular user
       )
       //once token is created u can send it to user in 2 ways - 1)directly in payload 2)sending in cookie
       // here we are sending in cookie
       res.cookie('access_token', token, {httpOnly: true}).status(200).json({
        status : 200,
        message : 'Login success',
        data : user
       });
       //check in postman in cookies tab u will get token for this request
    } catch (error) {
        // return res.status(500).send('Something went wrong!');
        return next(createError(500, 'Internal server error!')); //u can use abobve approach also but this is meaningful
    }
}


export const registerAdmin = async (req,res,next) => {
    try {
        const role = await Role.find({});  //here we are creating admin then he will be having both the roles user and admin as well, so we are not passing any filter in find ,, we have only 2 roles in db user and admin
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            username : req.body.username,
            email : req.body.email,
            password : hashPassword,
            isAdmin : true,
            roles : role    //here by default who ever is registering we are making them as User role so that's why we find and binding it to the roles
            // in postman or via ui we dont pass role in req.body.role here only we are adding it
        });
        await newUser.save();
        return next(createSuccess(200,'Admin Registered successfully'));
    } catch (error) {
        // return res.status(500).send('Something went wrong!');
        return next(createError(500, 'Internal server error!')); //u can use above approach also but this is meaningful
    }
}