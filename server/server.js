require('dotenv').config()
var express = require('express')
var bodyParser = require('body-parser')
var axios = require('axios')
var url = require('url')
var cors = require('cors')
var { Client } = require('pg')

var app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

if(process.env.WEB_STATUS == 'production'){
    sess.cookie.secure = true
}

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
                                    res.status(200).send({
                                        id: user.data.id,
                                        username: user.data.username,
                                        discriminator: user.data.discriminator,
                                        avatar: user.data.avatar,
                                        email: user.data.email,
                                        country: user.data.locale,
                                        access_token: access_token,
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

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(__dirname + '/public'))
    app.get(/.*/, (req, res) => {
        res.sendFile(__dirname + '/public/index.html')
    })
}

app.listen(process.env.WEB_PORT, () => {
    console.log(process.env.WEB_URL)
})