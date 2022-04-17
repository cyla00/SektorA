require('dotenv').config()
var { REST } = require('@discordjs/rest')
var { Routes } = require('discord-api-types/v9')
var { Client, Intents } = require('discord.js')
var client = new Client({ intents: [
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
] 
})
var { commands } = require('./commands.json')
var { admin, event_manager, player } = require('./roles.json')
var { event_notification_channel } = require('./channels.json')
var moment = require('moment')

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

client.on('ready', () => {

  console.log(`${client.user.tag} has a fancy hat $:)`)
})

// EMBEDS
var embed_color = 0x00ffe5

var title_embed = {
  color: embed_color,
  title: 'Set a title',
  footer: {
    text: 'reply or type "quit" to exit'
  },
}

var description_embed = {
  color: embed_color,
  title: 'Set a description',
  footer: {
    text: 'reply or type "quit" to exit'
  },
}

var price_embed = {
  color: embed_color,
  title: 'Set a price to join the game',
  fields: [
    {name: 'format', value: '**use numbers only**'}
  ],
  footer: {
    text: 'reply or type "quit" to exit'
  },
}

var datetime_embed = {
  color: embed_color,
  title: 'Set date and hour of the game',
  fields: [
    {name: 'format', value: '```YYYY-MM-DDTHH:MM:SS``` include the T in between, the time format is 24h'}
  ],
  footer: {
    text: 'reply or type "quit" to exit'
  },
}

var exit_embed = {
  color: embed_color,
  title: 'im out, to restart use the ```/launch``` command',
}

var error_embed = {
  color: embed_color,
  title: 'the date-time format or price format was not correct, please relaunch using ```/launch```',
}

var general_error_embed = {
  color: embed_color,
  title: 'an error occured, please retry or check ```/howto``` for more information.',
}

// COMMANDS EVENTS
client.on('interactionCreate', async interaction => {

  if (!interaction.isCommand()) return

  if (interaction.member.roles.cache.has(event_manager.id)) {

    // LAUNCH AN EVENT COMMAND
    if (interaction.commandName === 'event') {

      interaction.reply('please fill out the forms by replying to generate the event')

      var event_data = []
      var questions = [title_embed, description_embed, price_embed, datetime_embed]
      var counter = 0
      
      var filter = m => m.author.id == interaction.user.id
      var collector = interaction.channel.createMessageCollector({filter, max: 4})

      interaction.channel.send({embeds: [questions[counter++]]})



      collector.on('collect', m => {

        if (m.content == 'quit') {
          m.channel.send({embeds: [exit_embed]})
          return collector.stop()
        }

        if (counter < questions.length) {
          m.channel.send({embeds: [questions[counter++]]})
        }
      })

      collector.on('end', collected => {
        if (collected.size != 4) return

        collected.forEach(element => {
          event_data.push(element.content)
        })

        if (!moment(event_data[3].toString(), moment.ISO_8601, true).isValid()){
          interaction.channel.send({embeds: [error_embed]})
          return
        }
        var date = new Date(event_data[3])

        function hasOneDigit(val) {
          return String(Math.abs(val)).charAt(0) == val;
        }

        if (hasOneDigit(date.getDate())) {
          var day = `0${date.getDate()}`
        } 
        else {
          var day = date.getDate()
        }

        if (date.getHours() == '0') {
          var hours = `00:${date.getMinutes()}`
        }
        else {
          var hours = `${date.getHours()}:${date.getMinutes()}`
        }

        var formatted_date = `${date.getFullYear()}/${date.getMonth() + 1}/${day} at ${hours}`
        var event_embed = {
          color: embed_color,
          title: 'event',
          fields: [
            {name: 'title', value: `${event_data[0]}`},
            {name: 'description', value: `${event_data[1]}`},
            {name: 'price', value: `${parseInt(event_data[2]) || 0} €`},
            {name: 'date', value: `${formatted_date}`},
          ]
        }
        interaction.channel.send('this is a preview')
        interaction.channel.send({embeds: [event_embed]}).then(async event => {
          
          var confirm = '✅'
          var deny = '❌'
          await event.react(confirm)
          await event.react(deny)
          await event.channel.send(`to confirm the event ${confirm}, to destroy it ${deny}`)

          const confirm_filter = (reaction, user) => {
            return user.id === message.author.id
          }
          
          event.awaitReactions({confirm_filter, max: 1})
            .then((collected) => {
              if (collected.first().emoji.name == confirm) {
                if (event_notification_channel.id == "") {
                  var error_embed = {
                    color: embed_color,
                    title: 'please choose a channel to send the embed to, using the ```/set``` command.\nfor more info check ```/howto```',
                    footer: {
                      text: 'this message will autodestruct in 20 seconds'
                    }
                  }
                  interaction.channel.send({embeds: [error_embed]}).then(() => {
                    setTimeout(() => {
                      return interaction.channel.bulkDelete(14)
                    },3000)
                  }).catch(err => {
                    console.error(err)
                    return interaction.channel.send({embeds: [general_error_embed]})
                  })
                }
                else{
                  client.channels.cache.get(event_notification_channel.id).send({embeds: [event_embed]}).then(async event => {
                    await event.react('🃏')
                  }).catch(err => {
                    console.error(err)
                    return interaction.channel.send({embeds: [general_error_embed]})
                  })
                }
              }
              else if (collected.first().emoji.name == deny) {
                return interaction.channel.bulkDelete(13)
              }
            })
        }).catch(err => {
          console.error(err)
          return interaction.channel.send({embeds: [general_error_embed]})
        })
      })

    }
  }
  else {
    await interaction.reply('not allowed')
    return interaction.deleteReply()
  }


  // SET THE CHANNEL TO SEND THE EVENT EMBED TO
  if (interaction.commandName === 'set') {
    event_notification_channel.id = interaction.channel.id

    var embed = {
      color: embed_color,
      title: 'this channel will now be used to send game events notifications.\nreuse ```/set``` to change in any other channel',
    }
    interaction.reply({embeds: [embed]})
  }
})

client.login(process.env.TOKEN)