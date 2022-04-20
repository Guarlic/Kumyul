const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const img = 'https://blog.kakaocdn.net/dn/qpua2/btqyqx0g6YA/NYd5fopPNOBPwxDiYIXDK1/img.jpg';

module.exports = {
  name: "경고",
  description: "경고를 추가합니다.",
  execute(msg) {
    const user = msg.mentions.users.first();
    const temp = msg.content.slice(4);
    const target = user.id;
    const guild = msg.guild.id;
    const warn_num = Number(msg.content.slice(26));
    const warn_get = `warn.${guild}.${target}`;
    const warn = db.get(warn_get);

    db.add(warn_get, warn_num);

    if (warn == NaN) {
      const answerMessage = new MessageEmbed()
        .setAuthor('검열봇', img)
        .setTitle('**경고 추가**')
        .setDescription(`${temp} (이)라는 유저는 존재하지 않습니다!`);
      msg.reply({ embeds: [answerMessage] });
      return;
    }

    const answerMessage = new MessageEmbed()
      .setAuthor('검열봇', img)
      .setTitle('**경고 추가**')
      .setColor(0xBDBDBD)
      .setDescription(`<@${target}> 님의 경고를 ${warn_num} 만큼 추가합니다.`)
      .addField('누적 경고수', `${warn - warn_num} -> ${warn}`);
    msg.reply({ embeds: [answerMessage] });
  }
}