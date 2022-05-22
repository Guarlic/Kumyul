const db = require('quick.db');
const announcedb = new db.table('announce');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const img = 'https://cdn.discordapp.com/attachments/938745566647705690/966469502692900874/ab9ac7ad6be1ac73.jpeg';

module.exports = {
  name: '공지',
  description: '공지를 올립니다.',
  execute(client, msg) {
    const perms = msg.member.permissions;
    if (!perms.has('ADMINISTARTOR')) {
      msg.reply('이 명령어를 사용하려면 관리자 권한이 필요해요!');
      return;
    }

    const announce_message = msg.content.endsWith('--everyone') ? msg.content.substring(4, msg.content.length - 11) : msg.content.endsWith('--here') ? msg.content.substring(4, msg.content.length - 7) : msg.content.slice(4);
    const id = msg.author.id;
    const guild = msg.guild.id;
    const channel = announcedb.get(`${guild}.channel`);
    const announceid = Math.random().toString(36).substr(2, 16);

    if (channel == undefined) {
      msg.reply('저기요.. 채널설정은요 어디감;;');
    }

    const announce = new MessageEmbed()
      .setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.displayAvatarURL())
      .setColor(msg.member.displayHexColor)
      .setTitle('중요 공지사항이에요!')
      .setDescription(announce_message)
      .setFooter('⭕ 반응으로 확인을 표해요! (버튼이 아닌건 구알릭님이 귀찮ㄷ 읍읍!!)');

    client.channels.cache.get(channel).send({ content: msg.content.endsWith('--everyone') ? '@everyone!' : msg.content.endsWith('--here') ? '@here!' : '[Cdec발신]', embeds: [announce] }).then(msg => msg.react('⭕'));
  }
}
