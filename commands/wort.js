const { EmbedBuilder } = require('discord.js');

const WORDS_OF_DAY = [
  {
    word: 'die Sehnsucht',
    pronunciation: 'ZAYN-zookht',
    english: 'a deep longing or yearning',
    example: 'Er hat eine tiefe Sehnsucht nach seiner Heimat.',
    example_en: 'He has a deep longing for his homeland.',
    tip: '💡 "Sehnen" = to yearn + "Sucht" = addiction/craving. Literally: yearning-addiction!',
    level: 'B2',
  },
  {
    word: 'der Fernweh',
    pronunciation: 'FERN-vay',
    english: 'wanderlust; ache for distant places',
    example: 'Das Fernweh treibt sie immer wieder ins Ausland.',
    example_en: 'Wanderlust keeps driving her abroad again and again.',
    tip: '💡 "Fern" = far + "Weh" = ache/pain. The opposite is "Heimweh" (homesickness).',
    level: 'B1',
  },
  {
    word: 'der Fingerspitzengefühl',
    pronunciation: 'FING-er-shpit-sen-ge-fühl',
    english: 'intuition; a delicate touch or tact',
    example: 'Diese Situation erfordert viel Fingerspitzengefühl.',
    example_en: 'This situation requires a lot of tact.',
    tip: '💡 Literally "fingertip feeling" — sensitivity in handling delicate matters.',
    level: 'C1',
  },
  {
    word: 'verschlimmbessern',
    pronunciation: 'fer-SHLIM-bes-ern',
    english: 'to make something worse while trying to improve it',
    example: 'Er hat die Situation nur verschlimmbessert.',
    example_en: 'He only made the situation worse.',
    tip: '💡 "Schlimm" = bad + "bessern" = to improve. A perfect word for well-meaning mistakes!',
    level: 'C1',
  },
  {
    word: 'das Kopfkino',
    pronunciation: 'KOPF-kee-no',
    english: 'the cinema in your head; mental scenarios',
    example: 'Hör auf mit deinem Kopfkino!',
    example_en: 'Stop playing out scenarios in your head!',
    tip: '💡 "Kopf" = head + "Kino" = cinema. Used when someone overthinks or daydreams.',
    level: 'B1',
  },
  {
    word: 'die Weltanschauung',
    pronunciation: 'VELT-an-shau-ung',
    english: 'worldview; a comprehensive philosophy of life',
    example: 'Jeder Mensch hat seine eigene Weltanschauung.',
    example_en: 'Every person has their own worldview.',
    tip: '💡 "Welt" = world + "Anschauung" = view/perception. Even used in English philosophy!',
    level: 'B2',
  },
  {
    word: 'der Frühlingsgefühle',
    pronunciation: 'FRÜH-lings-ge-füh-le',
    english: 'spring feelings; romantic feelings in spring',
    example: 'Im April kommen die Frühlingsgefühle.',
    example_en: 'In April, spring feelings arrive.',
    tip: '💡 "Frühling" = spring + "Gefühle" = feelings. Often implies romance blooming!',
    level: 'A2',
  },
  {
    word: 'der Zeitgeist',
    pronunciation: 'TSAYT-gayst',
    english: 'the spirit of the times; defining mood of an era',
    example: 'Dieses Buch erfasst den Zeitgeist der 80er Jahre.',
    example_en: 'This book captures the spirit of the 80s.',
    tip: '💡 "Zeit" = time + "Geist" = spirit/ghost. Borrowed directly into English too!',
    level: 'B2',
  },
];

// Pick word based on day of year so it's consistent all day
function getTodaysWord() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return WORDS_OF_DAY[dayOfYear % WORDS_OF_DAY.length];
}

async function wort(interaction) {
  const w = getTodaysWord();

  const embed = new EmbedBuilder()
    .setColor(0xF97316)
    .setTitle('🌅 Wort des Tages — Word of the Day')
    .addFields(
      { name: '🇩🇪 German Word',    value: `## ${w.word}`,    inline: false },
      { name: '🔊 Pronunciation',   value: `*/${w.pronunciation}/*`, inline: true },
      { name: '📊 Level',            value: w.level,           inline: true },
      { name: '🇬🇧 Meaning',         value: w.english,         inline: false },
      { name: '💬 Example',
        value: `*${w.example}*\n> ${w.example_en}`,          inline: false },
      { name: w.tip.startsWith('💡') ? 'Memory Tip' : '💡 Memory Tip',
        value: w.tip,                                          inline: false },
    )
    .setFooter({ text: 'New word every day · /translate to look up more words' });

  await interaction.reply({ embeds: [embed] });
}

module.exports = { wort, getTodaysWord, WORDS_OF_DAY };
