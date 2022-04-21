const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const img = 'https://cdn.discordapp.com/attachments/938745566647705690/966469502692900874/ab9ac7ad6be1ac73.jpeg';

module.exports = {
  name: "경고",
  description: "경고를 추가합니다.",
  execute(msg) {
    const user = msg.mentions.users.first();
    const temp = msg.content.slice(4);
    const guild = msg.guild.id;
    const warn_num = Number(msg.content.slice(26));

    if (temp != '' && (!temp.startsWith('<@') && !temp.endsWith('>') || temp.startsWith('<@&'))) {
      const answerMessage = new MessageEmbed()
        .setAuthor('검열봇', img)
        .setTitle('**경고 초기화**')
        .setDescription(`${temp} (이)라는 유저는 존재하지 않습니다!`);
      msg.reply({ embeds: [answerMessage] });
      return;
    }
    else if (temp == '') {

    }

    if (user == NaN) {
      const answerMessage = new MessageEmbed()
        .setAuthor('검열봇', img)
        .setTitle('**경고 추가**')
        .setDescription(`${temp} (이)라는 유저는 존재하지 않습니다!`);
      msg.reply({ embeds: [answerMessage] });
      return;
    }

    const target = user.id;
    const warn_get = `warn.${guild}.${target}`;
    let warn = db.get(warn_get);

    const save = warn;

    if (warn == NaN || warn == undefined) db.set(warn_get, warn_num);
    else db.add(warn_get, warn_num);

    warn = db.get(warn_get);

    const answerMessage = new MessageEmbed()
      .setAuthor('검열봇', img)
      .setTitle('**경고 추가**')
      .setColor(0xBDBDBD)
      .setDescription(`<@${target}> 님의 경고를 ${warn_num} 만큼 추가합니다.`)
      .addField('누적 경고수', `${save} -> ${warn}`);
    msg.reply({ embeds: [answerMessage] });
  }
}