import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import roleApiObj from './Routes/role.js';
import authApiObj from './Routes/auth.js';
import userApiObj from './Routes/user.js';
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config();


//middlewares
app.use(express.json()); //to accept all the request bodies
app.use(cookieParser());
app.use('/api/role', roleApiObj);
app.use('/api/auth',authApiObj);
app.use('/api/users',userApiObj)

//Response handler middleware
app.use((obj,req,res,next)=>{
    const statusCode = obj.status || 500;
    const message = obj.message || 'Something went wrong';
    return res.status(statusCode).json({
        success : [200,201,204].some(a => a == obj.status) ? true : false,
        status : statusCode,
        message : message,
        data : obj.data
        // stack : err.stack 
    })
})


// DB Connection
const connectMongoDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to Database!');
    } catch (error) {
        throw error;
    }
}

app.listen(8800, ()=> {
    connectMongoDB();
    console.log('Connected to backend');
})