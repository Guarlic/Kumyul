const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const img = 'https://cdn.discordapp.com/attachments/938745566647705690/966469502692900874/ab9ac7ad6be1ac73.jpeg';

module.exports = {
  name: "경고지정",
  description: "대상의 경고를 지정합니다.",
  execute(msg, args) {
    const id = msg.author.id;
    const guild = msg.guild.id;
    const temp = msg.content.slice(6);
    const user = msg.mentions.users.first();
    const warn_num = Number(msg.content.slice(28));

    if (args > 2) {
      msg.reply('어.. ㅁ도움말 경고지정 이라고 해볼래요?');
      return;
    }

    if (temp.startsWith('<@&') || !temp.startsWith('<@') && !temp.endsWith('>') || user.id == undefined) {
      const answerMessage = new MessageEmbed()
        .setAuthor('시덱이', img)
        .setTitle('**경고 지정**')
        .setColor(0xBDBDBD)
        .setDescription(`**${temp} (이)라는 유저는 존재하지 않습니다!**`);
      msg.reply({ embeds: [answerMessage] });
      return;
    }

    const target = user.id;
    const warn_get = `warn.${guild}.${target}`;
    let warn = db.get(warn_get);

    if (user.bot) {
      const answerMessage = new MessageEmbed()
        .setAuthor('시덱이', img)
        .setTitle('**경고 지정**')
        .setColor(0xBDBDBD)
        .setDescription(`**<@${target}> (이)라는 유저는 봇입니다!**`);
      msg.reply({ embeds: [answerMessage] });
      return;
    }

    if (warn_num < 0) {
      msg.reply(`${warn_num}은 불가능해요!`);
      return;
    }

    const save = warn;

    db.set(warn_get, warn_num);

    warn = db.get(warn_get);

    const answerMessage = new MessageEmbed()
      .setAuthor('시덱이', img)
      .setTitle('**경고 지정**')
      .setColor(0xBDBDBD)
      .setDescription(`<@${target}> 님의 경고를 ${warn_num} 으로 설정합니다.`)
      .addField('누적 경고수', `${save == NaN ? 0 : save} -> ${warn}`);
    
    msg.reply({ embeds: [answerMessage] });
  }
}
