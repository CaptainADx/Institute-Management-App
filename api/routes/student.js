const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const Student = require("../model/Student");
const mongoose = require("mongoose"); 
const jwt = require("jsonwebtoken");
const cloudinary = require('cloudinary').v2;


// Now we're configuring the cloudinary file with variables in .env
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});


router.post('/', (req, res)=>{
    res.status(200).json({
        msg : 'add new student'
    })
})



//Add New Student
router.post('/add-student', checkAuth, (req, res) => {

    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

    //uploading course image to cloudinary
    cloudinary.uploader.upload(req.files.image.tempFilePath, (err, result) => {

        if (err) return res.status(500).json({ error: err.message });

        const newStudent = new Student({
            _id : new mongoose.Types.ObjectId(),
            fullName : req.body.fullName,
            phone : req.body.phone,
            email : req.body.email,
            address : req.body.address,
            imageId : result.public_id,
            imageURL : result.secure_url,
            courseId : req.body.courseId,
            uId : verify.uId,
        })
        newStudent.save()
        .then(result => {
            res.status(200).json({
                newStudent : result,
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error : err,
            })
        })
    })
});



//Get all students

router.get('/all-students', checkAuth, (req,res)=>{
    const token = req.headers.authorization.split(" ")[1]
    const verify = jwt.verify(token, process.env.TOKEN_SECRET_KEY)

    Student.find({uId : verify.uId})
    .select("_id uId fullName phone email address imageURL imageId courseId")
    .then(result => {
        res.status(200).json({
            students : result
        })
    })
    .catch(err => {
        res.status(500).json({
            error : err
        })
    })
})


//Get all students

router.get('/all-students/:courseId', checkAuth, (req,res)=>{
    const token = req.headers.authorization.split(" ")[1]
    const verify = jwt.verify(token, process.env.TOKEN_SECRET_KEY)

    Student.find({uId : verify.uId, courseId : req.params.courseId})
    .select("_id uId fullName phone email address imageURL imageId courseId")
    .then(result => {
        res.status(200).json({
            students : result
        })
    })
    .catch(err => {
        res.status(500).json({
            error : err
        })
    })
})



//Delete Student

router.delete("/:id", checkAuth, (req, res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, process.env.TOKEN_SECRET_KEY)

    Student.findById(req.params.id)
    .then(student => {
        console.log(student);
        if(student.uId == verify.uId){
            //delete
            Student.findByIdAndDelete(req.params.id)
            .then(result => {
                cloudinary.uploader.destroy(student.imageId , (err,result)=>{
                    res.status(200).json({
                        result : result
                    })
                })
            })
            .catch(err =>{
                res.status(500).json({
                    error : err
                })
            })
        }
        else{
            res.status(500).json({
                msg : "bad request"
            })
        }
    })
})



// Update the Student

router.put('/:id', checkAuth, (req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    console.log(verify.uId);

    //verifying the user first by our side
    Student.findById(req.params.id)
    .then(student => {
        if(student.uId != verify.uId){
            return res.status(500).json({
                error : "You're not eligible to update the course",
            })
        }
        //Checking if file is being updated with Student data
        if(req.files){
            cloudinary.uploader.destroy(student.imageId, (deleteImage) => {
                // after deleting the old image... we will upload the new image:
                cloudinary.uploader.upload(req.files.image.tempFilePath, (err, result) => {

                    if (err) return res.status(500).json({ error: err.message });

                    const newUpdatedStudent = {
                        fullName : req.body.fullName,
                        phone : req.body.phone,
                        email : req.body.email,
                        address : req.body.address,
                        imageId : result.public_id,
                        imageURL : result.secure_url,
                        courseId : req.body.courseId,
                        uId : verify.uId,
                    }
                    Student.findByIdAndUpdate(req.params.id, newUpdatedStudent, {new : true})
                    .then(data => {
                        res.status(200).json({
                            updatedStudent : data,
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error : err,
                        })
                    })
                })
            })
        }
        else{
            const updatedData = {
                fullName : req.body.fullName,
                phone : req.body.phone,
                email : req.body.email,
                address : req.body.address,
                imageId : student.public_id,
                imageURL : student.secure_url,
                courseId : req.body.courseId,
                uId : verify.uId,
            }

            //Now to get new updated data don't forget to use {new:true}
            Student.findByIdAndUpdate(req.params.id, updatedData, {new:true})
            .then(data => {
                res.status(200).json({
                    updatedData : data,
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error : err,
                })
            })
        }
        
    })
    .catch(err =>{
        res.status(500).json({
            error : err,
        })
    })
})



//Getting latest 5 students
router.get('/latest-students', checkAuth, (req,res) => {
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

    //getting data
    Student.find({uId : verify.uId})
    .sort({$natural : -1}).limit(5)
    .then(result => {
        res.status(200).json({
            students : result,
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