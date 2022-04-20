require('dotenv').config()
var express = require('express')
var bodyParser = require('body-parser')
var axios = require('axios')
var url = require('url')
var session = require('express-session')
var { v4: uuidv4 } = require('uuid')
var cors = require('cors')

var app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(`${__dirname}/public`))

var sess = {
    secret: uuidv4().toString(),
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 3600000,
        secure: false,
    },
}

if(process.env.WEB_STATUS == 'production'){
    sess.cookie.secure = true
}

app.use(session(sess))

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
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }).then(async event => {
                if(event.status !== 200) res.sendStatus(404)

                req.session.access_token = event.data.access_token

                await axios.get('https://discord.com/api/v8/users/@me', {
                    headers: {
                        'Authorization': `Bearer ${event.data.access_token}`,
                    }
                }).then(user => {
                    if(user.status !== 200) res.sendStatus(404)

                    var discord_user = user.data
                    
                    req.session.DS_id = discord_user.id
                    req.session.DS_username = `${discord_user.username}#${discord_user.discriminator}`
                    req.session.DS_email = discord_user.email
                    req.session.DS_verified = discord_user.verified
                    req.session.DS_image = `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.png`
                    res.send(req.session)
                    console.log(req.session)
                    console.log(user.data)
                    console.log(event.data)
                })
            }).catch(err => console.error(err))

            
        }
        catch(err){
            console.error(err)
            res.sendStatus(400)
        }
    }
})

app.listen(process.env.WEB_PORT, back => {
    console.log(process.env.WEB_URL)
})