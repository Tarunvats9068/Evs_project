const mongoose = require('mongoose');
const usersSchema = new mongoose.Schema({
    email:{
        type:String,
         required:true,
         unique:true
    },
    name:{
        type:String,
         required:true,
    },
    password:{
        type:String,
         required:true,
    },
    verify:{
        type:Boolean,
        default:false,
    }
},{timestamps: true});
const Users = mongoose.model('Users',usersSchema);
module.exports = Users;