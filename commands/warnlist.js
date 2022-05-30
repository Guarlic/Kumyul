const db = require('quick.db');
const warndb = new db.table('warn');
const { MessageEmbed } = require('discord.js');
const img = 'https://cdn.discordapp.com/attachments/938745566647705690/966469502692900874/ab9ac7ad6be1ac73.jpeg';

module.exports = {
  name: '경고수',
  description: '경고수를 표시합니다.',
  execute(client, msg, args) {
    const id = msg.author.id;
    const guild = msg.guild.id;
    const _temp = msg.content.slice(5);
    const user = msg.mentions.users.first();

    if (args.length > 2) {
      msg.reply('어.. ㅁ도움말 경고수 라고 해볼래요?');
      return;
    }

    if (_temp != '' && (_temp.startsWith('<@&') || !_temp.startsWith('<@') && !_temp.endsWith('>') || user.id == undefined)) {
      const answerMessage = new MessageEmbed()
        .setAuthor('시덱이', img)
        .setTitle('**⚠️ 경고 수**')
        .setColor(0xFFB2D9)
        .setDescription(`**<@${target} (이)라는 유저는 존재하지 않습니다!**`);
      msg.reply({ embeds: [answerMessage] });
      return;
    }

    if (_temp == '') {
      const answerMessage = new MessageEmbed()
        .setAuthor('시덱이', img)
        .setTitle('**⚠️ 경고 수**')
        .setColor(0xFFB2D9)
        .setDescription(`**현재 <@${id}> 님의 경고 횟수입니다!**`)
        .addField('누적 경고수', `${!warndb.get(`warn.${guild}.${id}`) || warndb.get(`warn.${guild}.${id}`) == undefined ? '당신은 현재 경고가 없습니다!' : db.get(`warn.${guild}.${id}`)}`);
      msg.reply({ embeds: [answerMessage] });
      return;
    }

    const target = user.id;
    const warn_get = `warn.${guild}.${target}`;
    const warn = warndb.get(warn_get);

    if (user.bot) {
      const answerMessage = new MessageEmbed()
        .setAuthor('시덱이', img)
        .setTitle('**⚠️ 경고 수**')
        .setColor(0xFFB2D9)
        .setDescription(`**<@${target}> (이)라는 유저는 봇입니다!**`);
      msg.reply({ embeds: [answerMessage] });
      return;
    }

    if (!warn) {
      const answerMessage = new MessageEmbed()
        .setAuthor('시덱이', img)
        .setTitle('**⚠️ 경고 수**')
        .setColor(0xFFB2D9)
        .setDescription(`**현재 <@${target}> 님의 경고 횟수입니다!**`)
        .addField('누적 경고수', `${target != id ? `<@${target}> 님은 현재 경고가 없습니다!` : '당신은 현재 경고가 없습니다!'}`);
      msg.reply({ embeds: [answerMessage] });
      return;
    }

    const answerMessage = new MessageEmbed()
      .setAuthor('시덱이', img)
      .setTitle('**⚠️ 경고 수**')
      .setColor(0xFFB2D9)
      .setDescription(`**현재 <@${target}> 님의 경고 횟수입니다!**`)
      .addField('누적 경고수', `${target != id ? `${warn ? warn : `현재 <@${target}> 님은 경고가 없습니다!`}` : `${warn ? warn : `당신은 현재 경고가 없습니다!`}`}`);
    msg.reply({ embeds: [answerMessage] });
  }
}
