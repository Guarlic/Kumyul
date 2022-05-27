const db = require('quick.db');
const warndb = new db.table('warn');
const { MessageEmbed } = require('discord.js');
const img = 'https://cdn.discordapp.com/attachments/938745566647705690/966469502692900874/ab9ac7ad6be1ac73.jpeg';

module.exports = {
  name: '경고초기화',
  description: '경고를 초기화합니다.',
  execute(client, msg, args) {
    const perms = msg.member.permissions;
    if (!perms.has('ADMINISTRATOR')) {
      msg.reply('이 명령어를 사용하려면 관리자 권한이 있어야해요!');
      return;
    }

    const id = msg.author.id;
    const guild = msg.guild.id;
    const user = msg.mentions.users.first();
    const temp = msg.content.slice(7);
    let target;

    if (user != null && temp.startsWith('<@') && temp.endsWith('>') && !temp.startsWith('<@&')) target = user.id;
    else target = id;

    if (temp != '' && args.length != 2 && target == undefined) {
      msg.reply('어.. ㅁ도움말 경고초기화 라고 해볼래요?');
      return;
    }

    const warn_get = `warn.${guild}.${target}`;
    const warn = warndb.get(warn_get);

    if (temp != '' && (!temp.startsWith('<@') && !temp.endsWith('>') || temp.startsWith('<@&'))) {
      const answerMessage = new MessageEmbed()
        .setAuthor('시덱이', img)
        .setTitle('**경고 초기화**')
        .setColor(0xFFB2D9)
        .setDescription(`${temp} (이)라는 유저는 존재하지 않습니다!`);
      msg.reply({ embeds: [answerMessage] });
      return;
    }

    if (user != null && user.bot) {
      const answerMessage = new MessageEmbed()
        .setAuthor('시덱이', img)
        .setTitle('**경고 초기화**')
        .setColor(0xFFB2D9)
        .setDescription(`**<@${target}> (이)라는 유저는 봇입니다!**`);
      msg.reply({ embeds: [answerMessage] });
      return;
    }

    const answerMessage = new MessageEmbed()
      .setAuthor('시덱이', img)
      .setTitle('**경고 초기화**')
      .setColor(0xFFB2D9)
      .setDescription(`<@${target}> 님의 경고를 초기화합니다!`)
      .addField('누적 경고수', `${warn == NaN || warn == undefined ? 0 : warn} -> 0`);
    warndb.set(warn_get, 0);
    msg.reply({ embeds: [answerMessage] });
  }
}
