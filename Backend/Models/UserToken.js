import mongoose , {Schema} from 'mongoose';

const tokenSchema = mongoose.Schema(
    {
        userId  :{
            type : Schema.Types.ObjectId,
            required : true,
            ref : 'User'    //reference table is user schema
        },
        token :{
            type : String,
            required : true
        },
        createdAt : {
            type : Date,
            default : Date.now,
            expires : 4200 //in seconds = 70 min
        }
    }
);

export default mongoose.model('Token',tokenSchema);