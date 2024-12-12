const express = require('express');
const app = express();
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');


/*
    CORS(Cross-Origin-Resource-Sharing) it is used when the Frontend runing on one Domain/PORT
    tries to the Backend running on another Domain/PORT
*/
const cors = require('cors');


// const bodyParser = require('body-parser');   // this line is not used because we have new module in express named as fileupload

const userRoute = require('./routes/user');
const studentRoute = require('./routes/student');
const feeRoute = require('./routes/fee');
const courseRoute = require('./routes/course');

// connecting mongoose
mongoose.connect('mongodb+srv://CaptainADx:7004388987ADx@captainadx.8l4ey.mongodb.net/?retryWrites=true&w=majority&appName=CaptainADx')
.then(()=>{
    console.log("connected to database")
})
.catch(err=>{
    console.log(err)
})


app.use(express.json()); 
app.use(cors());

// Below line is added to handle multiple line form data.
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/',
}))

// app.use(express.urlencoded({extended : true}))

// if someone enters requests as http://[url]/[route] it will navigate to corresponding route.

app.use('/user', userRoute);         //http://[url]/[user] 
app.use('/student', studentRoute);   //http://[url]/[student] 
app.use('/fee', feeRoute);
app.use('/course', courseRoute);


// if someone enters requests as http://[url]

app.use('*', (req, res) => {
    res.status(404).json({
        msg : 'bad request'
    })
});




module.exports = app;