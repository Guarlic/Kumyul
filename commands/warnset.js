const db = require('quick.db');
const warndb = new db.table('warn');
const { MessageEmbed } = require('discord.js');
const img = 'https://cdn.discordapp.com/attachments/938745566647705690/966469502692900874/ab9ac7ad6be1ac73.jpeg';

module.exports = {
  name: '경고지정',
  description: '대상의 경고를 지정합니다.',
  execute(client, msg, args) {
    const perms = msg.member.permissions;
    if (!perms.has('ADMINISTRATOR')) {
      msg.reply('이 명령어를 사용하려면 관리자 권한이 있어야해요!');
      return;
    }

    if (args.length != 2) {
      msg.reply('어.. ㅁ도움말 경고지정 이라고 해볼래요?');
      return;
    }

    const id = msg.author.id;
    const guild = msg.guild.id;
    const temp = msg.content.slice(6);
    const user = msg.mentions.users.first();
    const warn_num = Number(msg.content.slice(28));
    const value_get = `value.${guild}`;
    const value = warndb.get(value_get);

    if (temp.startsWith('<@&') || !temp.startsWith('<@') && !temp.endsWith('>') || user.id == undefined) {
      const answerMessage = new MessageEmbed()
        .setAuthor('시덱이', img)
        .setTitle('**경고 지정**')
        .setColor(0xFFB2D9)
        .setDescription(`**${temp} (이)라는 유저는 존재하지 않습니다!**`);
      msg.reply({ embeds: [answerMessage] });
      return;
    }

    const target = user.id;
    const warn_get = `warn.${guild}.${target}`;
    let warn = warndb.get(warn_get);

    if (user.bot) {
      const answerMessage = new MessageEmbed()
        .setAuthor('시덱이', img)
        .setTitle('**경고 지정**')
        .setColor(0xFFB2D9)
        .setDescription(`**<@${target}> (이)라는 유저는 봇입니다!**`);
      msg.reply({ embeds: [answerMessage] });
      return;
    }

    if (warn_num < 0) {
      msg.reply(`${warn_num}은 불가능해요!`);
      return;
    }

    const save = warn;

    warndb.set(warn_get, warn_num);

    warn = warndb.get(warn_get);

    const answerMessage = new MessageEmbed()
      .setAuthor('시덱이', img)
      .setTitle('**경고 지정**')
      .setColor(0xFFB2D9)
      .setDescription(`<@${target}> 님의 경고를 ${warn_num} 으로 설정합니다.`)
      .addField('누적 경고수', `${save == NaN || save == undefined ? 0 : save} -> ${warn}`);
    
    msg.reply({ embeds: [answerMessage] });

    if (warn >= value) {
      warndb.set(`warn.${guild}.${target}`, 0);

      try {
        msg.channel.send(`경고가 ${value} 회가 넘어 <@${target}> 님이 밴 되었습니다!`);
        msg.guild.members.ban(target)
          .then(banInfo => console.log(`${banInfo.user?.tag ?? banInfo.tag ?? banInfo} 를 밴했습니다.`))
          .catch(console.error);
      }
      catch (error) {
        msg.channel.send(`음.. <@${target}> 님은 밴을 못하겠어요..`);
        return;
      }
    }
  }
}
