import express from 'express';
import { login, register, registerAdmin, resetPassword, sendEmail } from '../Controllers/auth.controller.js';


const authApiObj = express.Router();

//register
authApiObj.post('/register',register);


//login
authApiObj.post('/login',login);

//register as Admin
authApiObj.post('/register-admin', registerAdmin);


//send reset email
authApiObj.post('/send-email',sendEmail);

//reset password
authApiObj.post('/reset-password', resetPassword)

export default authApiObj;