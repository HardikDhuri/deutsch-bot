const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
  new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Translate a word or phrase to German')
    .addStringOption(opt =>
      opt.setName('text').setDescription('Word or phrase to translate').setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('quiz')
    .setDescription('Test your German vocabulary')
    .addStringOption(opt =>
      opt.setName('level')
        .setDescription('Your CEFR level')
        .addChoices(
          { name: 'A1 – Beginner',      value: 'A1' },
          { name: 'A2 – Elementary',    value: 'A2' },
          { name: 'B1 – Intermediate',  value: 'B1' },
          { name: 'B2 – Upper-Intermediate', value: 'B2' },
        )
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName('wort')
    .setDescription('Get today\'s German word of the day'),

  new SlashCommandBuilder()
    .setName('correct')
    .setDescription('Check your German sentence for grammar errors')
    .addStringOption(opt =>
      opt.setName('sentence').setDescription('Your German sentence').setRequired(true)
    ),
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Slash commands registered!');
  } catch (err) {
    console.error(err);
  }
})();
