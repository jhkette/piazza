const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()

const authPiazza = require('./routes/auth')
const postPiazza = require('./routes/post')
const topicsPiazza = require('./routes/topic')
const commentsPiazza = require('./routes/comment')

const app = express()


mongoose.connect(process.env.DB_CONNECTOR,  {useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected Successfully'))

.catch((err) => { console.error(err); });

app.use(bodyParser.json())

app.use('/piazza/user',authPiazza)
app.use('/piazza/posts', postPiazza)
app.use('/piazza/topics', topicsPiazza)
app.use('/piazza/comments', commentsPiazza)

app.get('/', (req, res) => {
    res.send('homepage')
})
app.listen(process.env.PORT, () => {
    console.log(`server running on port:${process.env.PORT}`)
})

