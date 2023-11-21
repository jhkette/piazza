const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require("cors")
const dotenv = require('dotenv').config()
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");

// import routes
const authPiazza = require('./routes/auth')
const postPiazza = require('./routes/post')


// initialise express
const app = express()


// call mongoose to connect to mongodb database
mongoose.connect(process.env.DB_CONNECTOR,  {useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected Successfully'))

.catch((err) => { console.error(err); });

// stop cross origin resource sharing error on browser
app.use(cors())
// middleware to parse JSON
app.use(bodyParser.json())
// sanitise data
app.use(mongoSanitize());

// add more secure headers
app.use(helmet())



app.use('/piazza/user',authPiazza)
app.use('/piazza/posts', postPiazza)


// 404 error message for invalid urls
app.use((req, res) => {
    return res.status(404).json({ error: 'API endpoint not found' });  
})

app.listen(process.env.PORT, () => {
    console.log(`server running on port:${process.env.PORT}`)
})

