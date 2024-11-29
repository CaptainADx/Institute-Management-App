const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const User = require('../model/User');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


require('dotenv').config();

// Now we're configuring the cloudinary file with variables in .env
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
}); 

// Signup API
router.post('/signup', (req, res) => {
    // Check if a single user is found with the same email, then return and don't run the code further
    User.findOne({ email: req.body.email })
    .then(users => {
        if (users) {
            return res.status(400).json({ error: 'Email already registered.' });
        }

        // If no user with the email found, then proceed to upload image and create new user
        cloudinary.uploader.upload(req.files.image.tempFilePath, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error uploading image to Cloudinary.' });
            }

            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({ error: err });
                }

                const newUser = new User({
                    _id: new mongoose.Types.ObjectId(),
                    fullName: req.body.fullName,
                    phone: req.body.phone,
                    email: req.body.email,
                    password: hash,
                    imageId: result.public_id,
                    imageURL: result.secure_url
                });

                newUser.save() 
                .then(result => {
                    res.status(200).json({
                        newUser: result,
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        error: err,
                    });
                });
            });
        });
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
});

// Login API
router.post('/login', (req, res) => {
    console.log("Email from request body:", req.body.email);  // Debugging: log the email sent from request

    // Find the user by email
    User.findOne({ email: req.body.email })
    .then(users => {
        if (!users) {
            console.log("User not found in database.");  // Debugging: log if no user is found
            return res.status(401).json({ msg: "Email not registered" });
        }

        // Compare password
        bcrypt.compare(req.body.password, users.password, (err, result) => {
            if (err) {
                console.log("Error comparing password:", err);  // Debugging: log any error during password comparison
                return res.status(500).json({ msg: "Error comparing password" });
            }

            if (!result) {
                console.log("Password does not match");  // Debugging: log if password doesn't match
                return res.status(401).json({ msg: "Password not matched" });
            }

            // Generate JWT token
            const token = jwt.sign({
                    email: users.email,
                    fullName: users.fullName,
                    phone:users.phone,
                    uId: users._id,
                },
                process.env.TOKEN_SECRET_KEY,
                { expiresIn: "365d" }
            );

            res.status(200).json({
                _id: users._id,
                fullName: users.fullName,
                email: users.email,
                phone: users.phone,
                imageURL: users.imageURL,
                imageId: users.imageId,
                token: token,
            });
        });
    })
    .catch(err => {
        console.log("Error during user lookup:", err);  // Debugging: log any errors during user lookup
        res.status(500).json({ msg: "Server error", error: err });
    });
});

module.exports = router;