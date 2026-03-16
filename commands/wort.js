const { EmbedBuilder } = require('discord.js');

const WORDS_URL = 'https://raw.githubusercontent.com/Jonny-exe/German-Words-Library/master/German-words-5000-words.json';

// Cache word list in memory — fetched once per bot session
let wordListCache = null;

async function fetchWordList() {
  if (wordListCache) return wordListCache;
  const res  = await fetch(WORDS_URL);
  const data = await res.json();
  wordListCache = data;
  console.log(`📚 Word list loaded: ${data.length} words`);
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

// Same word all day, changes each day
async function getTodaysWord() {
  const words     = await fetchWordList();
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const word      = words[dayOfYear % words.length];
  const english   = await translateToEnglish(word);
  const article   = guessArticle(word);
  return { word, english, article };
}

// Fully random — used by scheduler
async function getRandomWord() {
  const words   = await fetchWordList();
  const word    = words[Math.floor(Math.random() * words.length)];
  const english = await translateToEnglish(word);
  const article = guessArticle(word);
  return { word, english, article };
}

async function wort(interaction) {
  await interaction.deferReply();
  try {
    const { word, english, article } = await getTodaysWord();
    const displayWord = article ? `${article} ${word}` : word;

    const embed = new EmbedBuilder()
      .setColor(0xF97316)
      .setTitle('🌅 Wort des Tages — Word of the Day')
      .addFields(
        { name: '🇩🇪 German',  value: `## ${displayWord}`, inline: false },
        { name: '🇬🇧 English', value: english || '*Translation unavailable*', inline: false },
        { name: '💡 Challenge', value: `Use **${word}** in a sentence in #deutsch-nur and ask for feedback!`, inline: false },
      )
      .setFooter({ text: 'Word changes daily · /quiz to test yourself · /translate for more words' });

    await interaction.editReply({ embeds: [embed] });
  } catch (err) {
    console.error(err);
    await interaction.editReply('❌ Could not fetch word of the day. Try again in a moment.');
  }
}

module.exports = { wort, getTodaysWord, getRandomWord };