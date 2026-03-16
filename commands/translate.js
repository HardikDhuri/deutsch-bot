const { EmbedBuilder } = require('discord.js');

// Gender detection heuristics for common German noun endings
function guessGender(word) {
  const w = word.toLowerCase();
  if (w.endsWith('ung') || w.endsWith('heit') || w.endsWith('keit') ||
      w.endsWith('schaft') || w.endsWith('tion') || w.endsWith('tät') ||
      w.endsWith('ik') || w.endsWith('ie')) return 'die (feminine)';
  if (w.endsWith('chen') || w.endsWith('lein') || w.endsWith('ment') ||
      w.endsWith('tum') || w.endsWith('um')) return 'das (neuter)';
  if (w.endsWith('er') || w.endsWith('en') || w.endsWith('el') ||
      w.endsWith('ismus') || w.endsWith('ist')) return 'der (masculine)';
  return null;
}

async function translate(interaction) {
  await interaction.deferReply();

  const text = interaction.options.getString('text');

  try {
    // MyMemory free API — no key needed, 5000 chars/day free
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|de`;
    const res  = await fetch(url);
    const data = await res.json();

    if (data.responseStatus !== 200) throw new Error('Translation failed');

    const translated = data.responseData.translatedText;

    // Try to get an example sentence (second translation hit if available)
    const matches = data.matches || [];
    const example = matches.find(m => m.segment !== text && m.translation && m.quality > 70);

    const gender = guessGender(translated);

    const embed = new EmbedBuilder()
      .setColor(0xF5C518)
      .setTitle('🔍 Translation Result')
      .addFields(
        { name: '🇬🇧 English',  value: text,       inline: true },
        { name: '🇩🇪 German',   value: `**${translated}**`, inline: true },
      );

    if (gender) embed.addFields({ name: '📖 Likely Gender', value: gender, inline: true });
    if (example) embed.addFields({ name: '💬 Example', value: `*${example.translation}*` });

    embed.setFooter({ text: 'Powered by MyMemory · /quiz to test yourself' });

    await interaction.editReply({ embeds: [embed] });

  } catch (err) {
    console.error(err);
    await interaction.editReply('❌ Translation failed. Try again in a moment.');
  }
}

module.exports = { translate };
