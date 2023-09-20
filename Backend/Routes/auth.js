import express from 'express';
import { login, register, registerAdmin } from '../Controllers/auth.controller.js';


const authApiObj = express.Router();

//register
authApiObj.post('/register',register);


//login
authApiObj.post('/login',login);

//register as Admin
authApiObj.post('/register-admin', registerAdmin);


export default authApiObj;