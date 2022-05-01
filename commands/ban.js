const db = require('quick.db');

module.exports = {
  name: '밴',
  description: '대상을 밴합니다.',
  execute(msg) {
    const perms = msg.member.permissions;
    if (!perms.has('ADMINISTARTOR')) {
      msg.reply('이 명령어를 사용하려면 관리자 권한이 있어야해요!');
      return;
    }

    const target = msg.mentions.users.first();
    const guild = msg.guild.id;

    if (target == undefined) {
      msg.reply('음.. 잘못된 타겟 같아요!');
      return;
    }

    const id = target.id;
    const warn_get = `warn.${guild}.${id}`;

    db.set(warn_get, 0);
    msg.reply('대상을 밴합니다.');

    msg.guild.members.ban(id)
      .then(banInfo => console.log(`${banInfo.user?.tag ?? banInfo.tag ?? banInfo} 를 밴했습니다.`))
      .catch(console.error);
  }
}
