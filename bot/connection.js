require('dotenv').config()
const { Client } = require('pg')

function buildDB () {
    var database = new Client()
    try {
        database.connect(async (err, db) => {
            if (err) throw err
            console.log('database connected')
            await db.query(`CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(100) UNIQUE NOT NULL,
                username VARCHAR(100) NOT NULL,
                discriminator VARCHAR(6) NOT NULL,
                created_on TIMESTAMP NOT NULL,
                last_login TIMESTAMP,
                isAdmin BOOLEAN  NOT NULL
             );`, (err, res) => {
                 if (err) throw err
                 console.log('User table created or already exists')
            })

            await db.query(`CREATE TABLE IF NOT EXISTS admins (
                id VARCHAR(100) UNIQUE NOT NULL,
                username VARCHAR(100) NOT NULL,
                discriminator VARCHAR(6) NOT NULL,
                created_on TIMESTAMP NOT NULL,
                last_login TIMESTAMP,
                isAdmin BOOLEAN  NOT NULL
             );`, (err, res) => {
                 if (err) throw err
                 console.log('Admin table created or already exists')
                 return database.end()
            })
        })
    }
    catch (err) {
        database.end()
        console.error(err)
    }
}

function add_bulk_users(id, username, discriminator){
    try{
        var database = new Client()

        database.connect(async (err, db) => {
            if (err) throw err
            var query_prep = `INSERT INTO users (
              id, 
              username, 
              discriminator,
              created_on, 
              last_login, 
              isAdmin
              ) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING;`

            var time = new Date().toISOString().slice(0, 19).replace('T', ' ');
  
            var values = [
              id, 
              username, 
              discriminator,
              time,
              null,
              false
            ]
  
            await db.query(query_prep, values,(err, res) => {
              if (err) throw err
              return database.end()
            })
        })
    }
    catch(err){
        console.error(err)
    }
}

module.exports = { buildDB, add_bulk_users }