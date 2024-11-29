const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    _id : mongoose.Types.ObjectId,
    courseName : {type:String, required:true},
    price : {type:Number, required:true},
    description : {type:String, required:true},
    startDate : {type:String, required:true},
    endDate : {type:String, required:true},
    imageId : {type:String, required:true},
    imageURL : {type:String, required:true},
    uId : {type:String, required:true},
})

module.exports = mongoose.model('Course', courseSchema);