const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const img = 'https://blog.kakaocdn.net/dn/qpua2/btqyqx0g6YA/NYd5fopPNOBPwxDiYIXDK1/img.jpg';

module.exports = {
  name: "경고초기화",
  description: "경고를 초기화합니다.",
  execute(msg) {
    const id = msg.author.id;
    const guild = msg.guild.id;
    const user = msg.mentions.users.first();
    const temp = msg.content.slice(7);
    let user_id;

    if (user != null && temp.startsWith('<@')) user_id = user.id;
    else user_id = id;

    const warn_get = `warn.${guild}.${user_id}`;
    const warn = db.get(warn_get);

    if (!temp.startsWith('<@') && !temp.endsWith('>') || temp.startsWith('<@&')) {
      const answerMessage = new MessageEmbed()
        .setAuthor('검열봇', img)
        .setTitle('**경고 초기화**')
        .setDescription(`${temp} (이)라는 유저는 존재하지 않습니다!`);
      msg.reply({ embeds: [answerMessage] });
      return;
    }

    const answerMessage = new MessageEmbed()
      .setAuthor('검열봇', img)
      .setTitle('**경고 초기화**')
      .setDescription(`<@${user_id}> 님의 경고를 초기화합니다!`)
      .addField('누적 경고수', `${warn} -> 0`);
    db.set(warn_get, 0);
    msg.reply({ embeds: [answerMessage] });
  }
}