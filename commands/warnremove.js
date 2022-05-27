const db = require('quick.db');
const warndb = new db.table('warn');
const { MessageEmbed } = require('discord.js');
const img = 'https://cdn.discordapp.com/attachments/938745566647705690/966469502692900874/ab9ac7ad6be1ac73.jpeg';

module.exports = {
  name: '경고차감',
  description: '경고를 차감합니다.',
  execute(client, msg, args) {
    const perms = msg.member.permissions;
    if (!perms.has('ADMINISTRATOR')) {
      msg.reply('이 명령어를 사용하려면 관리자 권한이 있어야해요!');
      return;
    }

    if (args.length != 2) {
      msg.reply('어.. ㅁ도움말 경고차감 이라고 해볼래요?');
      return;
    }

    const user = msg.mentions.users.first();
    const guild = msg.guild.id;
    const temp = msg.content.slice(6);
    let warn_num = 0 - Number(msg.content.slice(28));
    let flag = false;

    if (!temp.startsWith('<@') && !temp.endsWith('>') || temp.startsWith('<@&') || user.id == undefined) {
      const answerMessage = new MessageEmbed()
        .setAuthor('시덱이', img)
        .setTitle('**경고 차감**')
        .setDescription(`${temp} (이)라는 유저는 존재하지 않습니다!`);
      msg.reply({ embeds: [answerMessage] });
      return;
    }

    const target = user.id;
    const warn_get = `warn.${guild}.${target}`;
    let warn = warndb.get(warn_get);

    if (user.bot) {
      const answerMessage = new MessageEmbed()
        .setAuthor('시덱이', img)
        .setTitle('**경고 차감**')
        .setColor(0xFFB2D9)
        .setDescription(`**<@${target}> (이)라는 유저는 봇입니다!**`);
      msg.reply({ embeds: [answerMessage] });
      return;
    }

    if (warn + warn_num < 0 || warn == NaN) {
      warn_num = 0 - warn;
      flag = true;
    }

    const save = warn;

    if (warn == NaN) warndb.set(warn_get, warn_num);
    else warndb.add(warn_get, warn_num);

    warn = warndb.get(warn_get);

    const answerMessage = new MessageEmbed()
      .setAuthor('시덱이', img)
      .setTitle('**경고 차감**')
      .setColor(0xFFB2D9)
      .setDescription(`<@${target}> 님의 경고를 ${0 - warn_num} 만큼 차감합니다.\n${flag ? '경고 차감 횟수가 기존 경고보다 많아 0이 되었습니다!' : ''}`)
      .addField('누적 경고수', `${save == NaN || save == undefined ? 0 : save} -> ${flag ? 0 : warn}`);

    msg.reply({ embeds: [answerMessage] });
  }
}
