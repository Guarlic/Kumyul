const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const img = 'https://blog.kakaocdn.net/dn/qpua2/btqyqx0g6YA/NYd5fopPNOBPwxDiYIXDK1/img.jpg';

module.exports = {
  name: "경고차감",
  description: "경고를 차감합니다.",
  execute(msg) {
    const user = msg.mentions.users.first();
    const guild = msg.guild.id;
    const temp = msg.content.slice(6);
    let warn_num = 0 - Number(msg.content.slice(28));
    let flag = false;

    if (!temp.startsWith('<@') && !temp.endsWith('>') || temp.startsWith('<@&')) {
      const answerMessage = new MessageEmbed()
        .setAuthor('검열봇', img)
        .setTitle('**경고 초기화**')
        .setDescription(`${temp} (이)라는 유저는 존재하지 않습니다!`);
      msg.reply({ embeds: [answerMessage] });
      return;
    }

    const target = user.id;
    const warn_get = `warn.${guild}.${target}`;
    const warn = db.get(warn_get);

    if (warn + warn_num < 0 || warn == NaN) {
      warn_num = 0 - warn;
      flag = true;
    }

    const answerMessage = new MessageEmbed()
      .setAuthor('검열봇', img)
      .setTitle('**경고 차감**')
      .setColor(0xBDBDBD)
      .setDescription(`<@${target}> 님의 경고를 ${0 - warn_num} 만큼 차감합니다.\n${flag ? '경고 차감 횟수가 기존 경고보다 많아 0이 되었습니다!' : '\n'}`)
      .addField('누적 경고수', `${warn == NaN || !warn ? 0 : warn - warn_num} -> ${warn == NaN || !warn ? 0 : warn}`);
    if (warn == NaN) db.set(warn_get, warn_num);
    else db.add(warn_get, warn_num);
    msg.reply({ embeds: [answerMessage] });
  }
}