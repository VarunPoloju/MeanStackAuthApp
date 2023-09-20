import express from 'express';
import { getAllUsers, getUserById } from '../Controllers/user.controller.js';
import { verifyAdmin, verifyUser } from '../Utils/verifyToken.js';

const userApiObj = express.Router();

// get all users
userApiObj.get('/', verifyAdmin, getAllUsers) //only admin can able to see all the users not everyone so we need to protect for admin only
//to get the all the users the logged in person should be admin then only he can see all the users

//get user by id
userApiObj.get('/:id',verifyUser ,getUserById)    //only the logged in user should be able to check his profile


export default userApiObj;