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
    let warn_num = 0 - Number(msg.content.slice(28));
    const warn_get = `warn.${guild}.${target}`;
    const warn = db.get(warn_get);
    let flag = false;

    if (warn + warn_num < 0) {
      warn_num = warn;
      flag = true;
    }

    db.add(warn_get, warn_num);

    const answerMessage = new MessageEmbed()
      .setAuthor('검열봇', img)
      .setTitle('**경고 차감**')
      .setColor(0xBDBDBD)
      .setDescription(`<@${target}> 님의 경고를 ${0 - warn_num} 만큼 차감합니다.\n${flag ? '경고 차감 횟수가 기존 경고보다 많아 0이 되었습니다!' : '\n'}`)
      .addField('누적 경고수', `${db.get(warn_get) - warn_num} -> ${db.get(warn_get)}`);

    msg.reply({ embeds: [answerMessage] });
  }
}