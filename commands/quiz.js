const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const WORDS_URL = 'https://raw.githubusercontent.com/Jonny-exe/German-Words-Library/master/German-words-5000-words.json';

let wordListCache = null;

async function fetchWordList() {
  if (wordListCache) return wordListCache;
  const res  = await fetch(WORDS_URL);
  const data = await res.json();
  wordListCache = data;
  return data;
}

async function translateToEnglish(word) {
  const url  = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=de|en`;
  const res  = await fetch(url);
  const data = await res.json();
  if (data.responseStatus === 200) return data.responseData.translatedText;
  return null;
}

function guessArticle(word) {
  const w = word.toLowerCase();
  if (w.endsWith('ung') || w.endsWith('heit') || w.endsWith('keit') ||
      w.endsWith('schaft') || w.endsWith('tion') || w.endsWith('tät') ||
      w.endsWith('ik')    || w.endsWith('ie'))   return 'die';
  if (w.endsWith('chen') || w.endsWith('lein') || w.endsWith('ment') ||
      w.endsWith('tum')  || w.endsWith('um'))    return 'das';
  if (w.endsWith('er')   || w.endsWith('en')   || w.endsWith('el') ||
      w.endsWith('ismus') || w.endsWith('ist')) return 'der';
  return null;
}

// Active quiz sessions keyed by userId
const sessions = new Map();

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

async function quiz(interaction) {
  await interaction.deferReply();

  try {
    const words = await fetchWordList();

    // Pick 1 correct word + 3 random wrong words
    const correctWord   = words[Math.floor(Math.random() * words.length)];
    const englishMeaning = await translateToEnglish(correctWord);

    if (!englishMeaning || englishMeaning.toLowerCase() === correctWord.toLowerCase()) {
      // Bad translation — retry once
      return await quiz(interaction);
    }

    // Pick 3 wrong German options
    const wrongWords = [];
    while (wrongWords.length < 3) {
      const w = words[Math.floor(Math.random() * words.length)];
      if (w !== correctWord && !wrongWords.includes(w)) wrongWords.push(w);
    }

    const article     = guessArticle(correctWord);
    const displayCorrect = article ? `${article} ${correctWord}` : correctWord;
    const allOptions  = shuffle([
      displayCorrect,
      ...wrongWords.map(w => { const a = guessArticle(w); return a ? `${a} ${w}` : w; })
    ]);

    // Store session
    sessions.set(interaction.user.id, { correct: displayCorrect });

    const embed = new EmbedBuilder()
      .setColor(0x3B82F6)
      .setTitle('🎯 German Vocabulary Quiz')
      .setDescription(`What is the German word for **"${englishMeaning}"**?`)
      .setFooter({ text: 'Click the correct answer below!' });

    const row = new ActionRowBuilder().addComponents(
      allOptions.map((opt, i) =>
        new ButtonBuilder()
          .setCustomId(`quiz_${i}_${opt}`)
          .setLabel(opt)
          .setStyle(ButtonStyle.Primary)
      )
    );

    await interaction.editReply({ embeds: [embed], components: [row] });

  } catch (err) {
    console.error(err);
    await interaction.editReply('❌ Could not load quiz. Try again in a moment.');
  }
}

async function handleQuizAnswer(interaction) {
  if (!interaction.customId.startsWith('quiz_')) return;

  const userId  = interaction.user.id;
  const session = sessions.get(userId);
  if (!session) return interaction.reply({ content: '❓ No active quiz — use `/quiz` to start!', ephemeral: true });

  const parts   = interaction.customId.split('_');
  const chosen  = parts.slice(2).join('_');
  const isRight = chosen === session.correct;

  sessions.delete(userId);

  const embed = new EmbedBuilder()
    .setColor(isRight ? 0x22C55E : 0xEF4444)
    .setTitle(isRight ? '✅ Richtig! Gut gemacht!' : '❌ Nicht ganz...')
    .addFields(
      { name: 'Your answer',    value: chosen,           inline: true },
      { name: 'Correct answer', value: session.correct,  inline: true },
    )
    .setFooter({ text: 'Use /quiz to try another!' });

  await interaction.update({ embeds: [embed], components: [] });
}

module.exports = { quiz, handleQuizAnswer };