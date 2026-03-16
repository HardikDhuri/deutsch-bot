const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// Built-in word bank — extend freely!
const WORDS = {
  A1: [
    { en: 'the house',    de: 'das Haus',       wrong: ['der Haus', 'die Haus', 'ein Haus'] },
    { en: 'to eat',       de: 'essen',           wrong: ['trinken', 'schlafen', 'gehen'] },
    { en: 'the water',    de: 'das Wasser',      wrong: ['der Wasser', 'die Wasser', 'ein Wasser'] },
    { en: 'good morning', de: 'guten Morgen',    wrong: ['guten Abend', 'gute Nacht', 'auf Wiedersehen'] },
    { en: 'the dog',      de: 'der Hund',        wrong: ['die Hund', 'das Hund', 'der Katze'] },
    { en: 'thank you',    de: 'danke schön',     wrong: ['bitte schön', 'entschuldigung', 'gern geschehen'] },
    { en: 'the book',     de: 'das Buch',        wrong: ['der Buch', 'die Buch', 'das Büch'] },
    { en: 'to drink',     de: 'trinken',         wrong: ['essen', 'schlafen', 'sprechen'] },
  ],
  A2: [
    { en: 'the train station', de: 'der Bahnhof',      wrong: ['die Bahnhof', 'das Bahnhof', 'der Busbahnhof'] },
    { en: 'the weather',       de: 'das Wetter',        wrong: ['der Wetter', 'die Wetter', 'das Klima'] },
    { en: 'to understand',     de: 'verstehen',         wrong: ['erklären', 'sprechen', 'lernen'] },
    { en: 'the supermarket',   de: 'der Supermarkt',    wrong: ['die Supermarkt', 'das Supermarkt', 'der Markt'] },
    { en: 'I would like',      de: 'ich möchte',        wrong: ['ich will', 'ich kann', 'ich muss'] },
    { en: 'the appointment',   de: 'der Termin',        wrong: ['die Termin', 'das Termin', 'der Zeitpunkt'] },
  ],
  B1: [
    { en: 'the decision',    de: 'die Entscheidung',   wrong: ['der Entscheidung', 'das Entscheidung', 'die Entscheidungen'] },
    { en: 'nevertheless',    de: 'trotzdem',           wrong: ['deswegen', 'außerdem', 'allerdings'] },
    { en: 'the experience',  de: 'die Erfahrung',      wrong: ['das Erlebnis', 'der Erfahrung', 'die Erfahren'] },
    { en: 'to improve',      de: 'verbessern',         wrong: ['verschlechtern', 'verändern', 'verstärken'] },
    { en: 'the environment', de: 'die Umwelt',         wrong: ['der Umwelt', 'das Umwelt', 'die Umgebung'] },
  ],
  B2: [
    { en: 'despite',           de: 'trotz (+ Genitiv)',   wrong: ['wegen', 'während', 'statt'] },
    { en: 'the circumstance',  de: 'der Umstand',         wrong: ['die Umstand', 'das Umstand', 'die Umstände'] },
    { en: 'to negotiate',      de: 'verhandeln',          wrong: ['behandeln', 'behaupten', 'entscheiden'] },
    { en: 'the assumption',    de: 'die Annahme',         wrong: ['die Aussage', 'der Annahme', 'die Annahmen'] },
  ],
};

// Active quiz sessions keyed by userId
const sessions = new Map();

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

async function quiz(interaction) {
  const level = interaction.options.getString('level') || 'A1';
  const pool  = WORDS[level];
  const item  = pool[Math.floor(Math.random() * pool.length)];

  const allOptions = shuffle([item.de, ...item.wrong.slice(0, 3)]);

  // Store session
  sessions.set(interaction.user.id, { correct: item.de, level });

  const embed = new EmbedBuilder()
    .setColor(0x3B82F6)
    .setTitle(`🎯 German Vocabulary Quiz — Level ${level}`)
    .setDescription(`What is **"${item.en}"** in German?`)
    .setFooter({ text: 'Click the correct answer below!' });

  const row = new ActionRowBuilder().addComponents(
    allOptions.map((opt, i) =>
      new ButtonBuilder()
        .setCustomId(`quiz_${i}_${opt}`)
        .setLabel(opt)
        .setStyle(ButtonStyle.Primary)
    )
  );

  await interaction.reply({ embeds: [embed], components: [row] });
}

async function handleQuizAnswer(interaction) {
  if (!interaction.customId.startsWith('quiz_')) return;

  const userId  = interaction.user.id;
  const session = sessions.get(userId);
  if (!session) return interaction.reply({ content: '❓ No active quiz. Use `/quiz` to start!', ephemeral: true });

  // Extract the answer from button ID (everything after second underscore)
  const parts    = interaction.customId.split('_');
  const chosen   = parts.slice(2).join('_');
  const isRight  = chosen === session.correct;

  sessions.delete(userId);

  const embed = new EmbedBuilder()
    .setColor(isRight ? 0x22C55E : 0xEF4444)
    .setTitle(isRight ? '✅ Correct! Gut gemacht!' : '❌ Not quite...')
    .addFields(
      { name: 'Your answer',    value: chosen,          inline: true },
      { name: 'Correct answer', value: session.correct, inline: true },
    )
    .setFooter({ text: `Use /quiz ${session.level} to try again!` });

  await interaction.update({ embeds: [embed], components: [] });
}

module.exports = { quiz, handleQuizAnswer };
