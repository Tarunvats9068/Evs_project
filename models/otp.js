const mongoose = require('mongoose');
const usersSchema = new mongoose.Schema({
    otp:{
        type:String,
        required:true,
    },
    user:{ type:String,
           required:true,
}
},{timestamps: true});
const Otp = mongoose.model('Otp',usersSchema);
module.exports = Otp;
