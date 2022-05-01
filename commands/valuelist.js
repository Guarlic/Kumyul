const db = require('quick.db');
const warn = new db.table('warn');

module.exports = {
  name: '한도확인',
  description: '이 서버의 경고 한도를 보여줍니다.',
  execute(msg) {
    const guild = msg.guild.id;
    const value_get = `value.${guild}`;
    const value = warn.get(value_get);

    msg.reply(`현재 이 서버의 경고 한도는 ${value} 입니다!`);
  }
}
