require('dotenv').config()

var { REST } = require('@discordjs/rest')
var { Routes } = require('discord-api-types/v9')

var commands = [{
  name: 'ping',
  description: 'Replies with Pong!'
}]; 

var rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.')

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.')
  } catch (error) {
    console.error(error);
  }
})()

var { Client, Intents } = require('discord.js');
var client = new Client({ intents: [Intents.FLAGS.GUILDS] })

client.on('ready', () => {
  console.log(`${client.user.tag} has a fancy ass hat $:)!`)
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!')
  }
})

client.login(process.env.TOKEN)