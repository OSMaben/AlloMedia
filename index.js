require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload');
const cors = require('cors');
const userRoute = require('./routes/user');
const emailVerification = require('./routes/emailVerification');


app.use(bodyParser.json())
app.use(fileUpload());
app.use(express.static('uploads'));
app.use(cors());


// Connect to db
mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log("DB connected..");
  })
  .catch((error) => {
    console.log("Error on db connection: ", error)
  })

app.get('/', function (req, res) {
  res.status(200).json({
    msg: "Welcome to nodejs"
  })
})

app.use('/api', userRoute);
app.use('/api', emailVerification);


const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`)
})