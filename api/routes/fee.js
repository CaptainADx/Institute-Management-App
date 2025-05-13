const express = require('express');
const checkAuth = require('../middleware/checkAuth');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Fee = require('../model/Fee');



router.post('/add-fee', checkAuth, (req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

    const newFee = new Fee({
        _id : new mongoose.Types.ObjectId(),
        fullName : req.body.fullName,
        phone : req.body.phone,
        amount : req.body.amount,
        remark : req.body.remark,
        courseId : req.body.courseId,
        uId : verify.uId,
    })
    newFee.save()
    .then(result =>{
        res.status(200).json({
            newFees : result,
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err,
        })
    })
})


//Get all fee collection for the user
router.get('/payment-history', checkAuth, (req,res)=>{
    const token = req.headers.authorization.split(" ")[1]
    const verify = jwt.verify(token, process.env.TOKEN_SECRET_KEY)

    Fee.find({uId : verify.uId})
    .then(result => {
        res.status(200).json({
            paymentHistory : result,
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error :err,
        })
    })
})


//get all payment history for a user

router.get('/all-payment', checkAuth, (req,res)=>{
    const token = req.headers.authorization.split(" ")[1]
    const verify = jwt.verify(token, process.env.TOKEN_SECRET_KEY)

    console.log(req.query);

    Fee.find({uId:verify.uId, courseId:req.query.courseId, phone:req.query.phone})
    .then(result => {
        res.status(200).json({
            fees : result,
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error : err,
        })
    })

})


module.exports = router;