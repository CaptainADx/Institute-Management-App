const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const Course = require("../model/Course");
const mongoose = require("mongoose"); 
const jwt = require("jsonwebtoken");
const cloudinary = require('cloudinary').v2;
const Student = require("../model/Student");


// Now we're configuring the cloudinary file with variables in .env
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});


//Add New Course
router.post('/add-course', checkAuth, (req, res) => {

    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

    //uploading course image to cloudinary
    cloudinary.uploader.upload(req.files.image.tempFilePath, (err, result) => {

        if (err) return res.status(500).json({ error: err.message });

        const newCourse = new Course({
            _id : new mongoose.Types.ObjectId(),
            courseName : req.body.courseName,
            price : req.body.price,
            description : req.body.description,
            startDate : req.body.startDate,
            endDate : req.body.endDate,
            uId : verify.uId,
            imageId : result.public_id,
            imageURL : result.secure_url,
        })
        newCourse.save()
        .then(result => {
            res.status(200).json({
                newCourse : result,
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
 
// Get all course for any user
router.get('/all-courses', checkAuth, (req,res)=>{
    const token = req.headers.authorization.split(" ")[1]
    const verify = jwt.verify(token, process.env.TOKEN_SECRET_KEY)

    Course.find({uId : verify.uId})
    .then(result => {
        res.status(200).json({
            courses : result
        })
    })
    .catch(err => {
        res.status(500).json({
            error : err
        })
    })
})

// Get one course for particular ID

router.get('/course-detail/:id', checkAuth, (req,res)=>{
    const token = req.headers.authorization.split(" ")[1]
    const verify = jwt.verify(token, process.env.TOKEN_SECRET_KEY)

    Course.findById({_id : req.params.id})
    .select("_id courseName price description startDate endDate imageURL imageId")
    .then(result => {
        Student.find({courseId : req.params.id})
        .then(students => {
            res.status(200).json({
                courses : result,
                studentList : students,
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error : err,
            })
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        })
    })
})

//Delete a course

router.delete("/:id", checkAuth, (req, res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, process.env.TOKEN_SECRET_KEY)

    Course.findById(req.params.id)
    .then(course => {
        console.log(course);
        if(course.uId == verify.uId){
            //delete
            Course.findByIdAndDelete(req.params.id)
            .then(result => {
                cloudinary.uploader.destroy(course.imageId , (err,result)=>{
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



// Update the course 

router.put('/:id', checkAuth, (req,res)=>{
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    console.log(verify.uId);

    //verifying the user first by our side
    Course.findById(req.params.id)
    .then(course => {
        if(course.uId != verify.uId){
            return res.status(500).json({
                error : "You're not eligible to update the course",
            })
        }
        //Checking if file is being updated with course data
        if(req.files){
            cloudinary.uploader.destroy(course.imageId, (deleteImage) => {
                // after deleting the old image... we will upload the new image:
                cloudinary.uploader.upload(req.files.image.tempFilePath, (err, result) => {

                    if (err) return res.status(500).json({ error: err.message });

                    const newUpdatedCourse = {
                        courseName : req.body.courseName,
                        price : req.body.price,
                        description : req.body.description,
                        startDate : req.body.startDate,
                        endDate : req.body.endDate,
                        uId : verify.uId,
                        imageId : result.public_id,
                        imageURL : result.secure_url,
                    }
                    Course.findByIdAndUpdate(req.params.id, newUpdatedCourse, {new : true})
                    .then(data => {
                        res.status(200).json({
                            updatedCourse : data,
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
            courseName : req.body.courseName,
            price : req.body.price,
            description : req.body.description,
            startDate : req.body.startDate,
            endDate : req.body.endDate,
            uId : verify.uId,
            imageId : course.imageId,
            imageURL : course.imageURL,
            }

            //Now to get new updated data don't forget to use {new:true}
            Course.findByIdAndUpdate(req.params.id, updatedData, {new:true})
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



//Getting latest 5 Courses
router.get('/latest-courses', checkAuth, (req,res) => {
    const token = req.headers.authorization.split(" ")[1];
    const verify = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

    //getting data
    Course.find({uId : verify.uId})
    .sort({$natural : -1}).limit(5)
    .then(result => {
        res.status(200).json({
            courses : result,
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