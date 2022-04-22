const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const img = 'https://cdn.discordapp.com/attachments/938745566647705690/966469502692900874/ab9ac7ad6be1ac73.jpeg';

module.exports = {
  name: "경고초기화",
  description: "경고를 초기화합니다.",
  execute(msg) {
    const id = msg.author.id;
    const guild = msg.guild.id;
    const user = msg.mentions.users.first();
    const temp = msg.content.slice(7);
    let target;

    if (user != null && temp.startsWith('<@') && temp.endsWith('>') && !temp.startsWith('<@&')) target = user.id;
    else target = id;

    const warn_get = `warn.${guild}.${target}`;
    const warn = db.get(warn_get);

    if (temp != '' && (!temp.startsWith('<@') && !temp.endsWith('>') || temp.startsWith('<@&'))) {
      const answerMessage = new MessageEmbed()
        .setAuthor('검열봇', img)
        .setTitle('**경고 초기화**')
        .setDescription(`${temp} (이)라는 유저는 존재하지 않습니다!`);
      msg.reply({ embeds: [answerMessage] });
      return;
    }

    if (user != null && user.bot) {
      const answerMessage = new MessageEmbed()
        .setAuthor('검열봇', img)
        .setTitle('**경고 초기화**')
        .setColor(0xBDBDBD)
        .setDescription(`**${_temp} (이)라는 유저는 봇입니다!**`);
      msg.reply({ embeds: [answerMessage] });
      return;
    }

    const answerMessage = new MessageEmbed()
      .setAuthor('검열봇', img)
      .setTitle('**경고 초기화**')
      .setDescription(`<@${target}> 님의 경고를 초기화합니다!`)
      .addField('누적 경고수', `${warn == NaN ? 0 : warn} -> 0`);
    db.set(warn_get, 0);
    msg.reply({ embeds: [answerMessage] });
  }
}