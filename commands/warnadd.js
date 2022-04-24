const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
const img = 'https://cdn.discordapp.com/attachments/938745566647705690/966469502692900874/ab9ac7ad6be1ac73.jpeg';

module.exports = {
  name: "경고",
  description: "경고를 추가합니다.",
  execute(msg, args) {
    const perms = msg.member.permissions;
    if (!perms.has('ADMINISTRATOR')) {
      msg.reply('이 명령어를 사용하려면 관리자 권한이 있어야해요!');
      return;
    }

    if (args > 3 || args < 2) {
      msg.reply('어.. ㅁ도움말 경고 라고 해볼래요?');
      return;
    }

    const user = msg.mentions.users.first();
    const temp = msg.content.slice(4);
    const guild = msg.guild.id;
    const warn_text = temp != ' ' ? msg.content.slice(26) : msg.content.slice(4);
    let warn_num = temp != ' ' ? Number(msg.content.slice(26)) : Number(msg.content.slice(4));
    const id = msg.author.id;

    if (warn_text == '') warn_num = 1;

    if (!temp.startsWith('<@') && !temp.endsWith('>') || temp.startsWith('<@&') || user.id == undefined) {
      const answerMessage = new MessageEmbed()
        .setAuthor('시덱이', img)
        .setTitle('**경고 초기화**')
        .setDescription(`${temp} (이)라는 유저는 존재하지 않습니다!`);
      msg.reply({ embeds: [answerMessage] });
      return;
    }

    const target = user.id;

    if (user.bot) {
      const answerMessage = new MessageEmbed()
        .setAuthor('시덱이', img)
        .setTitle('**⚠️ 경고 수**')
        .setColor(0xBDBDBD)
        .setDescription(`**<@${target}> (이)라는 유저는 봇입니다!**`);
      msg.reply({ embeds: [answerMessage] });
      return;
    }

    if (user == NaN) {
      const answerMessage = new MessageEmbed()
        .setAuthor('시덱이', img)
        .setTitle('**경고 추가**')
        .setDescription(`${temp} (이)라는 유저는 존재하지 않습니다!`);
      msg.reply({ embeds: [answerMessage] });
      return;
    }

    const warn_get = `warn.${guild}.${target}`;
    let warn = db.get(warn_get);

    const save = warn;

    if (warn == NaN || warn == undefined) db.set(warn_get, warn_num);
    else db.add(warn_get, warn_num);

    warn = db.get(warn_get);

    const answerMessage = new MessageEmbed()
      .setAuthor('시덱이', img)
      .setTitle('**경고 추가**')
      .setColor(0xBDBDBD)
      .setDescription(`<@${target}> 님의 경고를 ${warn_num} 만큼 추가합니다.`)
      .addField('누적 경고수', `${save == NaN || save == undefined ? 0 : save} -> ${warn}`);
    msg.reply({ embeds: [answerMessage] });

    if (warn >= 100) {
      db.set(`warn.${guild}.${id}`, 0);
      msg.channel.send(`경고가 100회가 넘어 <@${id}> 님이 밴 되었습니다!`);
      msg.guild.members.ban(msg.author.id)
        .then(banInfo => console.log(`${banInfo.user?.tag ?? banInfo.tag ?? banInfo} 를 밴했습니다.`))
        .catch(console.error);
    }
  }
}
