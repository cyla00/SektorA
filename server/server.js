require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/', (req, res) => {
    console.log(req.body)
    return res.sendStatus(200)
})

app.listen(process.env.WEB_PORT)