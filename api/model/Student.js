const mongoose = require('mongoose');


const studentSchema = new mongoose.Schema({
    _id : mongoose.Types.ObjectId,
    fullName : {type:String, required:true},
    phone : {type:String, required:true},
    email : {type:String, required:true},
    address : {type:String, required:true},
    imageId : {type:String, required:true},
    imageURL : {type:String, required:true},
    courseId : {type:String, required:true},
    uId : {type:String, required:true},
}, {timestamps:true});   //TimeStamps is used to know when a Student was added.

module.exports = mongoose.model('Student', studentSchema);