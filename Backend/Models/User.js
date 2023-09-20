import mongoose , {Schema} from 'mongoose';

const UserSchema = mongoose.Schema(
    {
        firstName : {
            required : true,
            type : String
        },
        lastName : {
            required : true,
            type : String
        },
        username : {
            required : true,
            type : String,
            unique : true
        },
        email : {
            required : true,
            type : String,
            unique : true
        },
        password : {
            required : true,
            type : String,
        },
        profileImage : {
            type : String,
            required :false,
            default : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
        },
        isAdmin : {
            type : Boolean,
            default : false, //whenever we are doing registration it is not always required he is admin he can be user also 
        },
        roles : {
            type : [Schema.Types.ObjectId],  //foreign key 
            required : true,
            ref : 'Role'    //which schema it's referring to
        }
    },
    {
        timestamps :   true
    }
)

export default mongoose.model('User', UserSchema);