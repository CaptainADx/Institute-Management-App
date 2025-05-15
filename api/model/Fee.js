const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
    _id : mongoose.Types.ObjectId,
    fullName : {type : String, required : true},
    phone : {type : String, required : true},
    amount : {type : Number, required : true},
    remark : {type : String, required : true},
    uId : {type : String, required : true},
    courseId : {type : String, required : true},
}, {timestamps : true})

module.exports = mongoose.model("Fee", feeSchema)