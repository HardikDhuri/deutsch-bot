const { EmbedBuilder } = require('discord.js');

async function correct(interaction) {
  await interaction.deferReply();

  const sentence = interaction.options.getString('sentence');

  try {
    // LanguageTool public API — free, no key needed
    const res = await fetch('https://api.languagetool.org/v2/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        text: sentence,
        language: 'de',
        enabledOnly: 'false',
      }),
    });

    const data = await res.json();
    const matches = data.matches || [];

    if (matches.length === 0) {
      const embed = new EmbedBuilder()
        .setColor(0x22C55E)
        .setTitle('✅ Looks great! Keine Fehler gefunden.')
        .setDescription(`Your sentence: *"${sentence}"*`)
        .addFields({ name: '🎉 Result', value: 'No grammar errors detected! Well done!' })
        .setFooter({ text: 'Keep practising — /quiz to test more vocabulary' });
      return await interaction.editReply({ embeds: [embed] });
    }

    // Build corrected sentence by applying replacements
    let corrected = sentence;
    let offset = 0;
    for (const m of matches) {
      if (m.replacements.length > 0) {
        const best = m.replacements[0].value;
        const start = m.offset + offset;
        const end   = start + m.length;
        corrected = corrected.slice(0, start) + best + corrected.slice(end);
        offset += best.length - m.length;
      }
    }

    // Build error details (max 3 to avoid embed overflow)
    const errorFields = matches.slice(0, 3).map((m, i) => ({
      name: `⚠️ Error ${i + 1}: "${sentence.slice(m.offset, m.offset + m.length)}"`,
      value: [
        `**Issue:** ${m.message}`,
        m.replacements.length > 0
          ? `**Suggestion:** ${m.replacements.slice(0, 3).map(r => `\`${r.value}\``).join(' · ')}`
          : '',
        m.rule?.category?.name ? `**Category:** ${m.rule.category.name}` : '',
      ].filter(Boolean).join('\n'),
      inline: false,
    }));

    const embed = new EmbedBuilder()
      .setColor(0xEF4444)
      .setTitle(`✏️ ${matches.length} Error${matches.length > 1 ? 's' : ''} Found`)
      .addFields(
        { name: '📝 Your sentence',    value: `*${sentence}*`,   inline: false },
        { name: '✅ Suggested fix',     value: `**${corrected}**`, inline: false },
        ...errorFields,
      )
      .setFooter({ text: 'Powered by LanguageTool · Keep practising!' });

    await interaction.editReply({ embeds: [embed] });

  } catch (err) {
    console.error(err);
    await interaction.editReply('❌ Grammar check failed. Please try again in a moment.');
  }
}

module.exports = { correct };
