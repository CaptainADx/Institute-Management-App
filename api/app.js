const express = require('express');
const app = express();
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const userRoute = require('./routes/user');
const studentRoute = require('./routes/student');
const feeRoute = require('./routes/fee');
const courseRoute = require('./routes/course');

// Connecting to MongoDB
mongoose.connect('mongodb+srv://CaptainADx:7004388987ADx@captainadx.8l4ey.mongodb.net/?retryWrites=true&w=majority&appName=CaptainADx')
.then(() => {
    console.log("Connected to database");
})
.catch(err => {
    console.log(err);
});

app.use(express.json());
app.use(cors());

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
