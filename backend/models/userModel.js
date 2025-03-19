import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {type:String, required:true},
    mobile:{type:Number, required:true, unique:true},
    password:{type: String, required:true},
    confirm_password:{type: String, required:true},
    cartData:{type: Object, default:{}}
},{minimize:false})

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel