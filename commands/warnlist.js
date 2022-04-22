const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const img = 'https://cdn.discordapp.com/attachments/938745566647705690/966469502692900874/ab9ac7ad6be1ac73.jpeg';

module.exports = {
  name: "경고수",
  description: "경고수를 표시합니다.",
  execute(msg) {
    const id = msg.author.id;
    const guild = msg.guild.id;
    const _temp = msg.content.slice(5);

    if (_temp != '' && (_temp.startsWith('<@&') || !_temp.startsWith('<@') && !_temp.endsWith('>'))) {
      const answerMessage = new MessageEmbed()
        .setAuthor('검열봇', img)
        .setTitle('**⚠️ 경고 수**')
        .setColor(0xBDBDBD)
        .setDescription(`**${_temp} (이)라는 유저는 존재하지 않습니다!**`);
      msg.reply({ embeds: [answerMessage] });
      return;
    }

    if (_temp == '') {
      const answerMessage = new MessageEmbed()
        .setAuthor('검열봇', img)
        .setTitle('**⚠️ 경고 수**')
        .setColor(0xBDBDBD)
        .setDescription(`**현재 <@${id}> 님의 경고 횟수입니다!**`)
        .addField('누적 경고수', `${!db.get(`warn.${guild}.${id}`) ? '당신은 현재 경고가 없습니다!' : db.get(`warn.${guild}.${id}`)}`);
      msg.reply({ embeds: [answerMessage] });
      return;
    }

    const target = msg.mentions.users.first();
    const temp = target.id;
    const warn_get = `warn.${guild}.${temp}`;
    const warn = db.get(warn_get);

    if (target.bot) {
      const answerMessage = new MessageEmbed()
        .setAuthor('검열봇', img)
        .setTitle('**⚠️ 경고 수**')
        .setColor(0xBDBDBD)
        .setDescription(`**${_temp} (이)라는 유저는 봇입니다!**`);
      msg.reply({ embeds: [answerMessage] });
      return;
    }

    if (!warn) {
      const answerMessage = new MessageEmbed()
        .setAuthor('검열봇', img)
        .setTitle('**⚠️ 경고 수**')
        .setColor(0xBDBDBD)
        .setDescription(`**현재 ${_temp} 님의 경고 횟수입니다!**`)
        .addField('누적 경고수', `${temp != id ? `${_temp} 님은 현재 경고가 없습니다!` : '당신은 현재 경고가 없습니다!'}`);
      msg.reply({ embeds: [answerMessage] });
      return;
    }

    const answerMessage = new MessageEmbed()
      .setAuthor('검열봇', img)
      .setTitle('**⚠️ 경고 수**')
      .setColor(0xBDBDBD)
      .setDescription(`**현재 ${_temp} 님의 경고 횟수입니다!**`)
      .addField('누적 경고수', `${temp != id ? `${warn ? warn : `현재 ${_temp} 님은 경고가 없습니다!`}` : `${warn ? warn : `당신은 현재 경고가 없습니다!`}`}`);
    msg.reply({ embeds: [answerMessage] });
  }
}