import mongoose from 'mongoose';

const roleSchema = mongoose.Schema(
    {
        role : {
            type : String,  //primary key here acts as foreign key in user schema
            required : true
        }
    },
    {
        timestamps : true
    }
)

export default mongoose.model('Role', roleSchema);