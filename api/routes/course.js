const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");
const Course = require("../model/Course");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const Student = require("../model/Student");

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// ✅ Add New Course
router.post("/add-course", checkAuth, async (req, res) => {
    try {
        // Token Verification
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Authorization token missing" });
        }

        let verify;
        try {
            verify = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        } catch (err) {
            console.error("JWT Verification Error:", err);
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        // Validate required fields
        if (!req.files || !req.files.image) {
            return res.status(400).json({ error: "Image file is required" });
        }

        // Upload course image to Cloudinary
        const result = await cloudinary.uploader.upload(req.files.image.tempFilePath);
        
        // Create a new course
        const newCourse = new Course({
            _id: new mongoose.Types.ObjectId(),
            courseName: req.body.courseName,
            price: req.body.price,
            description: req.body.description,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            uId: verify.uId,
            imageId: result.public_id,
            imageURL: result.secure_url,
        });

        // Save to database
        const savedCourse = await newCourse.save();
        res.status(200).json({ newCourse: savedCourse });

    } catch (err) {
        console.error("Error Adding Course:", err);
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get all courses for a user
router.get("/all-courses", checkAuth, async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const verify = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

        const courses = await Course.find({ uId: verify.uId });
        res.status(200).json({ courses });
    } catch (err) {
        console.error("Error Fetching Courses:", err);
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get details of a specific course
router.get("/course-details/:id", checkAuth, async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const verify = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

        const course = await Course.findById(req.params.id).select("_id courseName price description startDate endDate imageURL imageId");
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        const students = await Student.find({ courseId: req.params.id });
        res.status(200).json({ course, studentList: students });
    } catch (err) {
        console.error("Error Fetching Course Details:", err);
        res.status(500).json({ error: err.message });
    }
});

// ✅ Delete a course
router.delete("/:id", checkAuth, async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const verify = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        if (course.uId !== verify.uId) {
            return res.status(403).json({ error: "Unauthorized to delete this course" });
        }

        await Course.findByIdAndDelete(req.params.id);
        await cloudinary.uploader.destroy(course.imageId);

        res.status(200).json({ message: "Course deleted successfully" });
    } catch (err) {
        console.error("Error Deleting Course:", err);
        res.status(500).json({ error: err.message });
    }
});

// ✅ Update a course
router.put("/:id", checkAuth, async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const verify = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        if (course.uId !== verify.uId) {
            return res.status(403).json({ error: "Unauthorized to update this course" });
        }

        let updatedData = {
            courseName: req.body.courseName,
            price: req.body.price,
            description: req.body.description,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            uId: verify.uId,
            imageId: course.imageId,
            imageURL: course.imageURL,
        };

        if (req.files && req.files.image) {
            await cloudinary.uploader.destroy(course.imageId);
            const result = await cloudinary.uploader.upload(req.files.image.tempFilePath);
            updatedData.imageId = result.public_id;
            updatedData.imageURL = result.secure_url;
        }

        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        res.status(200).json({ updatedCourse });
    } catch (err) {
        console.error("Error Updating Course:", err);
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get latest 5 courses
router.get("/latest-courses", checkAuth, async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const verify = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

        const courses = await Course.find({ uId: verify.uId }).sort({ $natural: -1 }).limit(5);
        res.status(200).json({ courses });
    } catch (err) {
        console.error("Error Fetching Latest Courses:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
