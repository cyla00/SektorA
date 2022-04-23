require('dotenv').config()
var express = require('express')
var bodyParser = require('body-parser')
var axios = require('axios')
var url = require('url')
var session = require('express-session')
var { v4: uuidv4 } = require('uuid')
var cors = require('cors')
var { Client } = require('pg')
var AesEncryption = require('aes-encryption')

var app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

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

app.post('/api/auth', async (req, res) => {

    var code = req.headers.authorization

    if(code){
        try{

            var data = new url.URLSearchParams({
                'client_id': process.env.CLIENT_ID.toString(),
                'client_secret': process.env.CLIENT_SECRET,
                'grant_type': 'authorization_code',
                'code': code.toString(),
                'redirect_uri': `http://localhost:3000/auth`
            })

            await axios.post('https://discord.com/api/v8/oauth2/token', data.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }).then(async event => {
                var access_token = event.data.access_token

                await axios.get('https://discord.com/api/v8/users/@me', {
                    headers: {
                        'Authorization': `Bearer ${access_token}`,
                    }
                }).then(user => {

                    var database = new Client()

                    try{
                        database.connect(async (err, db) => {
                            if (err) throw err
                            var query = 'select exists(select 1 from users where id=$1)'
                            await db.query(query, [user.id],(err, data) => {
                                if (err) throw err

                                if(data){

                                    var AES = new AesEncryption()

                                    AES.setSecretKey(process.env.KEY)

                                    console.log(user)
                                    res.status(200).send({
                                        id: AES.encrypt(user.data.id),
                                        username: AES.encrypt(user.data.username),
                                        discriminator: AES.encrypt(user.data.discriminator),
                                        avatar: AES.encrypt(user.data.avatar),
                                        email: AES.encrypt(user.data.email),
                                        country: AES.encrypt(user.data.locale),
                                        access_token: AES.encrypt(access_token),
                                        key: process.env.KEY
                                    })
                                }
                                else{
                                    res.sendStatus(403)
                                }
                                return database.end()
                            })
                        })
                    }
                    catch(err){
                        console.error(err)
                    }
                }).catch(err => console.error(err))
            }).catch(err => console.error(err))
        }
        catch(err){
            console.error(err)
            res.sendStatus(403)
        }
    }
    else{
        res.sendStatus(403)
    }
})

app.listen(process.env.WEB_PORT, () => {
    console.log(process.env.WEB_URL)
})