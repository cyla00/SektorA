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
    {name: 'format', value: '```YYYY-MM-DDTHH:MM:SS``` (include the T in between)'}
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

// COMMANDS EVENTS
client.on('interactionCreate', async interaction => {

  if (!interaction.isCommand()) return

  if (interaction.member.roles.cache.has(event_manager.id)) {

    if (interaction.commandName === 'launch') {

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

        var event_embed = {
          color: embed_color,
          title: 'event',
          fields: [
            {name: 'title', value: `${event_data[0]}`},
            {name: 'description', value: `${event_data[1]}`},
            {name: 'price', value: `${parseInt(event_data[2]) || 0} €`},
            {name: 'date', value: `${event_data[3]}`},
          ]
        }

        interaction.channel.send({embeds: [event_embed]})
      })

    }
  }
  else {
    await interaction.reply('not allowed')
    return interaction.deleteReply()
  }
})

client.login(process.env.TOKEN)