require('dotenv').config();

const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { translate } = require('./commands/translate');
const { quiz, handleQuizAnswer } = require('./commands/quiz');
const { wort } = require('./commands/wort');
const { correct } = require('./commands/correct');
const { scheduleWordOfDay } = require('./scheduler');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  scheduleWordOfDay(client);
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    if (interaction.commandName === 'translate') await translate(interaction);
    if (interaction.commandName === 'quiz')      await quiz(interaction);
    if (interaction.commandName === 'wort')      await wort(interaction);
    if (interaction.commandName === 'correct')   await correct(interaction);
  }

  // Handle quiz button clicks
  if (interaction.isButton()) {
    await handleQuizAnswer(interaction);
  }
});

client.login(process.env.DISCORD_TOKEN);
