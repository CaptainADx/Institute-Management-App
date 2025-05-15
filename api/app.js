const express = require('express');
const app = express();
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const userRoute = require('./routes/user');
const studentRoute = require('./routes/student');
const feeRoute = require('./routes/fee');
const courseRoute = require('./routes/course');
require('dotenv').config();

// Connecting to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to database"))
    .catch(err => console.log(err));

app.use(express.json());

// ✅ FIX: Dynamic CORS based on frontend origin
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3002",
    credentials: true,
}));

// Handling multipart/form-data
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
}));

// Routes
app.use('/user', userRoute);
app.use('/student', studentRoute);
app.use('/fee', feeRoute);
app.use('/course', courseRoute);

// Handle invalid routes
app.use('*', (req, res) => {
    res.status(404).json({
        msg: 'Bad Request'
    });
});

module.exports = app;