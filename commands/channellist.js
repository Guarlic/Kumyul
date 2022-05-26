const db = require('quick.db');
const announcedb = new db.table('announce');

module.exports = {
  name: '채널확인',
  description: '공지를 올릴 채널을 확인합니다.',
  execute(client, msg) {
    const guild = msg.guild.id;
    const channel = announcedb.get(`${guild}.channel`);

    if (channel == null) {
      msg.reply('공지 채널이 없는데여;;');
      return;
    }

    msg.reply(`현재 공지 채널은 <#${channel}> 이예에에에에요!`);
  }
}
