require('dotenv').config()
var { REST } = require('@discordjs/rest')
var { Routes } = require('discord-api-types/v9')
var { Client, Intents, MessageActionRow, MessageButton } = require('discord.js')
var bot = new Client({ intents: [
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  Intents.FLAGS.GUILD_MEMBERS,
  Intents.FLAGS.GUILD_PRESENCES,
  Intents.FLAGS.DIRECT_MESSAGES,
  ]
})
var { commands } = require('./commands.json')
var { admin, event_manager, player } = require('./roles.json')
var { event_notification_channel } = require('./channels.json')
var moment = require('moment')
var { buildDB, add_bulk_users, delete_user } = require('./connection')

var rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.')

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands },
    )

    console.log('Successfully reloaded application (/) commands.')
  } catch (error) {
    console.error(error)
  }
})()

bot.on('ready', () => {
  buildDB()
  console.log(`${bot.user.tag} has a fancy hat $:)`)
})

// EMBEDS SETTINGS
var embed_color = 0x00ffe5

// COMMANDS EVENTS.
bot.on('interactionCreate', async interaction => {

  if (!interaction.isCommand()) return

  if (interaction.member.roles.cache.has(event_manager.id)) {

    // UPDATE DATABASE PLAYER LIST 
    if(interaction.commandName == commands[1].name){
      interaction.guild.members.fetch().then(users => {
        users.forEach(async member => {
          if(member.user.id == bot.user.id) return
          try{
            await add_bulk_users(member.user.id, member.user.username, member.user.discriminator)
          }
          catch(err){
            console.error(err)
            return
          }
        })
      })

      var embed = {
        color: embed_color,
        title: `database has been updated`,
        footer: {
          text: 'this message will autodelete in 20 seconds'
        }
      }

      interaction.reply({embeds: [embed]}).then(() => {
        setTimeout(() => {
          interaction.deleteReply()
        }, 20000)
      })
    }
  }
  else {
    await interaction.reply('not allowed').then(() => {
      setTimeout(() => {
        return interaction.deleteReply()
      }, 10000)
    })
  }
})


// WHEN BOT JOINS A SERVER
bot.on('guildCreate', async (res) => {
  await res.members.fetch().then(members => {

      members.forEach(async member => {
        if (member.user.id == bot.user.id) return
        await add_bulk_users(member.user.id, member.user.username, member.user.discriminator)
      })
  }).catch(err => {
    console.error(err)
  })
})


// WHEN A MEMBER JOINS THE SERVER
bot.on('guildMemberAdd', (res) => {
  try {
    add_bulk_users(res.user.id, res.user.username, res.user.discriminator)
  }
  catch (err) {
    console.error(err)
  }
})

// WHEN A MEMBER LEAVES A SERVER
bot.on('guildMemberRemove', (res) => {
  try {
    delete_user(res.user.id)
  }
  catch (err) {
    console.error(err)
  }
})

bot.login(process.env.TOKEN)


