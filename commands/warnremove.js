const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const img = 'https://blog.kakaocdn.net/dn/qpua2/btqyqx0g6YA/NYd5fopPNOBPwxDiYIXDK1/img.jpg';

module.exports = {
  name: "경고차감",
  description: "경고를 차감합니다.",
  execute(msg) {
    const user = msg.mentions.users.first();
    const target = user.id;
    const guild = msg.guild.id;
    const warn_num = 0 - Number(msg.content.slice(28));
    const warn_get = `warn_${guild}_${target}`;

    db.add(warn_get, warn_num);

    const answerMessage = new MessageEmbed()
      .setAuthor('검열봇', img)
      .setTitle('** 경고 추가**')
      .setColor(0xBDBDBD)
      .setDescription(`<@${target}> 님의 경고를 ${0 - warn_num} 만큼 차감합니다.`)
      .addField('누적 경고수', `${db.get(warn_get) - warn_num} -> ${db.get(warn_get)}`);

    msg.reply({ embeds: [answerMessage] });
  }
}