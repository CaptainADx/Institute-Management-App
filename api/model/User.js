const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    _id : mongoose.Types.ObjectId,
    fullName : {type : String, required : true},
    email : {type:String, required:true},
    phone : {type:String, required:true},
    password : {type:String, required : true},
    imageURL :{type:String, required:true},
    imageId : {type:String, required:true}
})

module.exports = mongoose.model('User', userSchema);