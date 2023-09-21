import  Role  from '../Models/Role.js';
import User from '../Models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createError } from './../Utils/error.js';
import { createSuccess } from './../Utils/success.js';
import UserToken from '../Models/UserToken.js';
import nodemailer from 'nodemailer';

export const register = async (req,res,next) => {
    try {
        const role = await Role.find({role : 'User'});  //User is already created so we are , finding the user role
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            username : req.body.userName,
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
        // return next(createError(400,'Password incorrect!'));
        res.send({
            message: "invalidpassword"
          })
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

export const sendEmail = async (req,res,next) =>{
    const email = req.body.email; // extract the email fom req body
    //check if email exist
    const user = await User.findOne({email : {$regex : '^'+email+'$', $options :'i'}})  //pattern to check email, i - will not check for case-sensitve
    //if user not found
    if(!user){
        return next(createError(404, 'User not found to reset email'));
    }
    //if user preset then create token for that create payload first
    const payload = {
        email : user.email
    }
    const expiryTime = 4200;    //for testing purpose extending more time but it should be less like five minutes in real time
    //create token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: expiryTime});   //token created 
    //now we have to store the token
    const newToken = new UserToken({
        //we need to pass two things for sending it to database
        userId : user._id,
        token : token
    }); //now we'll store this token in DB 
    // now we have to send an email for that we need nodemailer package

    const mailTransporter = nodemailer.createTransport({
        service : 'gmail' , //which service u are using to send email u need to specify here
        auth : {
            //for authentication u need to pass username and password
            user : 'ronaldoc4164@gmail.com',  //email id which u want to use
            pass : 'nklq hqep tquf netx' // not the password we use fo gmail login, this we have to generate in the google 
        }
    });

    //now we have to create the mail detail
    let mailDetails = {
        from : 'ronaldoc4164@gmail.com', //from where u want to send the email
        to : email, // user
        subject : 'Reset Password!',
        html :  `
        <html>
  <head>
    <title>Password Reset Request</title>
  </head>

  <body>

    <h1>Password Reset Request</h1>
    <p>Dear ${user.username},</p>
    <p>We have received ur request to reset ur password for your account with bookmybook, To complete the process please click on the button below:</p>
    <a href=${process.env.LIVE_URL}/reset/${token}> <button style="background-color: #4CAF50; color: white; padding: 14px 20px; border: none; cursor: pointer; border-radius: 4px;">Reset Password</button></a>
    <p>Please note that this link will be valid for only 5 Minutes. If you do not initiate password reset request please ignore this email</p>
    <p>Thank you,</p>
    <p>Varun Poloju</p>
  </body>
</html>
 `
}
    // once the above content is ready then u will send email
    mailTransporter.sendMail(mailDetails, async(err,data)=>{
        if(err){    //if any error while sending email
            console.log(err);
            return next(createError(500, 'Something went wrong'));
        }
        else{
            //if no error in sending mail then save the newToken
            await newToken.save();
            return next(createSuccess(200, 'Email sent successfully'))
        }
    })

}

export const resetPassword = async (req,res,next) =>{
    //get token i.e coming from the request body
    const token = req.body.token; //sent from angular and we get new password as well
    const newPassword = req.body.password; 

    //first we have to verify the token
    jwt.verify(token , process.env.JWT_SECRET, async(err, data) =>{
        if(err){
            return next(createError(500, 'Reset Link is expired'));
        }
        else{
            const response = data;  //this data consists of email
            //now we have to validate if user is there are not
            const user = await User.findOne({email : {$regex : '^'+response.email+'$', $options :'i'}})  //pattern to check email, i - will not check for case-sensitve
            // if we find the user in database
            const salt = await bcrypt.genSalt(10);
            const encryptedPassword = await bcrypt.hash(newPassword, salt);
            user.password = encryptedPassword;
            //after encrypting the new passowrd update the user
            try {
                const updatedUser = await User.findOneAndUpdate(
                    {_id : user._id},
                    {$set : user},
                    {new : true}
                )
                return next(createSuccess(200, 'Password reset success!'))
            } catch (error) {
                return next(createError(500, 'something went wrong in resetting the password!'))
            }
        }
    })
}