const db = require('quick.db');
const warn = new db.table('warn');

module.exports = {
  name: '한도설정',
  description: '경고 한도를 설정합니다.',
  execute(client, msg) {
    const perms = msg.member.permissions;
    if (!perms.has('ADMINISTRATOR')) {
      msg.reply('이 명령어를 사용하려면 관리자 권한이 있어야해요!');
      return;
    }

    const guild = msg.guild.id;
    const value_get = `value.${guild}`;
    const value_num = Number(msg.content.slice(6));
    const warn_get = `warn.${guild}`;

    if (value_num <= 0) {
      msg.reply('ㅇㅖ? 모두를 밴하고 싶으신가요?');
      return;
    }

    warn.set(value_get, value_num);
    warn.set(warn_get, {});

    msg.reply(`성공적으로 경고 한도를 ${value_num} (으)로 바꾸었습니다!`);
  }
}
