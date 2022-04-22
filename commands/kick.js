const db = require('quick.db');
const img = 'https://cdn.discordapp.com/attachments/938745566647705690/966469502692900874/ab9ac7ad6be1ac73.jpeg';

module.exports = {
  name: "킥",
  description: "대상을 킥합니다.",
  execute(msg) {
    const target = msg.mentions.users.first();
    const guild = msg.guild.id;

    if (target == undefined) {
      msg.reply('ng target');
      return;
    }

    const id = target.id;
    const warn_get = `warn.${guild}.${id}`;

    db.set(warn_get, 0);
    msg.reply('대상을 킥합니다.');
    msg.guild.members.kick(id)
      .then(banInfo => console.log(`${banInfo.user?.tag ?? banInfo.tag ?? banInfo} 를 밴했습니다.`))
      .catch(console.error);
  }
}