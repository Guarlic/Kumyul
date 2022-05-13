const db = require('quick.db');

module.exports = {
  name: '킥',
  description: '대상을 킥합니다.',
  execute(msg) {
    const perms = msg.member.permissions;
    if (!perms.has('ADMINISTRATOR')) {
      msg.reply('이 명령어를 사용하려면 관리자 권한이 있어야해요!');
      return;
    }

    const target = msg.mentions.users.first();
    const guild = msg.guild.id;

    if (target == undefined) {
      msg.reply('ng target');
      return;
    }

    const id = target.id;
    const warn_get = `warn.${guild}.${id}`;

    db.set(warn_get, 0);

    try {
      msg.guild.members.kick(id)
        .then(kickInfo => console.log(`${kickInfo.user?.tag ?? kickInfo.tag ?? kickInfo} 를 밴했습니다.`))
    }
    catch (error) {
      msg.reply('그 대상은 밴 할 수 없는 것 같아요!');
    }

    msg.reply('대상을 킥합니다.');
  }
}
