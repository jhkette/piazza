const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()

// import routes
const authPiazza = require('./routes/auth')
const postPiazza = require('./routes/post')
const votesPiazza = require('./routes/vote')
const commentsPiazza = require('./routes/comment')

// initialise express
const app = express()

// call mongoose to connect to mongodb database
mongoose.connect(process.env.DB_CONNECTOR,  {useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected Successfully'))

.catch((err) => { console.error(err); });

app.use(bodyParser.json())
app.use('/piazza/vote', votesPiazza)
app.use('/piazza/user',authPiazza)
app.use('/piazza/posts', postPiazza)

app.use('/piazza/comments', commentsPiazza)

// 404 error message for invalid urls
app.use((req, res) => {
    return res.status(404).json({ error: 'API endpoint not found' });  
})

app.listen(process.env.PORT, () => {
    console.log(`server running on port:${process.env.PORT}`)
})

