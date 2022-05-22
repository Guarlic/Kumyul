const db = require('quick.db');
const announcedb = new db.table('announce');

module.exports = {
  name: '채널설정',
  description: '공지를 올릴 채널을 설정합니다.',
  execute(client, msg) {
    const guild = msg.guild.id;
    const channel = msg.content.slice(6);

    if (!(channel.startsWith('<#') && channel.endsWith('>'))) {
      msg.reply('흠.. 그거 채널 멘션 맞아요?');
      return;
    }

    announcedb.set(`${guild}.channel`, channel.substring(2, 20));
    msg.reply(`성공적으로 공지 채널을 ${channel} (으)로 바꿨어요!`);
  }
}
