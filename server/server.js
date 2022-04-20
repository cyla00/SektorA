require('dotenv').config()
var express = require('express')
var bodyParser = require('body-parser')
var axios = require('axios')
var app = express()
var url = require('url')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/api/auth/discord', async (req, res) => {

    var { code } = req.query

    if(code){
        try{
            var data = new url.URLSearchParams({
                'client_id': process.env.CLIENT_ID.toString(),
                'client_secret': process.env.CLIENT_SECRET,
                'grant_type': 'authorization_code',
                'code': code.toString(),
                'redirect_uri': `${process.env.WEB_URL}/api/auth/discord`
            })

            await axios.post('https://discord.com/api/v8/oauth2/token', data.toString(), {
                'headers': {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }).then(event => {
                console.log(event.data)
                res.send(event.data)
            })
        }
        catch(err){
            console.error(err);
            res.sendStatus(400)
        }
    }
})

app.listen(process.env.WEB_PORT)