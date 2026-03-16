const { EmbedBuilder } = require('discord.js');
const { getTodaysWord } = require('./commands/wort');

function scheduleWordOfDay(client) {
  const channelId = process.env.WORT_CHANNEL_ID;
  if (!channelId) {
    console.log('⚠️  WORT_CHANNEL_ID not set — daily word scheduler disabled.');
    return;
  }

  function msUntil9am() {
    const now  = new Date();
    const next = new Date();
    next.setHours(9, 0, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    return next - now;
  }

  async function postWordOfDay() {
    try {
      const channel = await client.channels.fetch(channelId);
      if (!channel) return;

      const w = getTodaysWord();

      const embed = new EmbedBuilder()
        .setColor(0xF97316)
        .setTitle('🌅 Wort des Tages — Word of the Day')
        .addFields(
          { name: '🇩🇪 German Word',  value: `## ${w.word}`,    inline: false },
          { name: '🔊 Pronunciation', value: `*/${w.pronunciation}/*`, inline: true },
          { name: '📊 Level',          value: w.level,           inline: true },
          { name: '🇬🇧 Meaning',       value: w.english,         inline: false },
          { name: '💬 Example',
            value: `*${w.example}*\n> ${w.example_en}`,          inline: false },
          { name: '💡 Memory Tip',     value: w.tip,             inline: false },
        )
        .setFooter({ text: 'Use /wort to get this any time · /translate to look up more words' });

      await channel.send({ embeds: [embed] });
      console.log(`📬 Word of the day posted: ${w.word}`);

    } catch (err) {
      console.error('Failed to post word of the day:', err);
    }
  }

  // Schedule first post
  setTimeout(() => {
    postWordOfDay();
    // Then repeat every 24 hours
    setInterval(postWordOfDay, 24 * 60 * 60 * 1000);
  }, msUntil9am());

  console.log(`⏰ Word of the day scheduled for 9:00 AM daily in channel ${channelId}`);
}

module.exports = { scheduleWordOfDay };
