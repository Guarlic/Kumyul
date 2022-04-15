let { MessageEmbed, Client, Intents, Collection } = require('discord.js');
let fs = require('fs');
let client = new Client({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES ] });
client.commands = new Collection();

const { clientid, token } = require('./config.json');

let datajson = fs.readFileSync('data.json', 'utf-8');

let obj = JSON.parse(datajson);
let datalist = obj.datalist;

client.once('ready', () => {
  console.log(`${client.user.tag} (검열봇) 이 준비되었습니다!`);
  client.user.setActivity('욕설', { type: "LISTENING" });
});

client.on("messageCreate", async msg => {
  if (msg.author.bot) return;
  console.log(
    `[ ${msg.guild.name} ] "${msg.channel.name}" ${msg.member.user.username}#${msg.member.user.discriminator} : ${msg.content}`
  );

  const id = msg.author.id;
  const name = msg.author.username;
  const filePath = `data/${id}.json`;

  !fs.existsSync(filePath) ? fs.writeFileSync(filePath, JSON.stringify({})) : null;
  const user = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  if (user.warn < 1) user.warn = 0;

  let saveUser = {};

  for (var i = 0; i < datalist.length; i++) {
    if (msg.content.search(datalist[i].DataName) != -1) {
      console.log('욕설이 감지되었습니다!');
      saveUser = {
        warn: user.warn + 1
      };
      const alertMessage = new MessageEmbed()
        .setAuthor('검열봇', 'https://blog.kakaocdn.net/dn/qpua2/btqyqx0g6YA/NYd5fopPNOBPwxDiYIXDK1/img.jpg')
        .setTitle('**욕설이 감지되었습니다!**')
        .setColor(0xBDBDBD)
        .setDescription(`${datalist[i].Output} <@${msg.author.id}>님!! ${msg.content}(이)라뇨!`)
        .addField('누적 경고 수', `${!user.warn ? 1 : user.warn + 1}`);
      msg.delete();
      msg.channel.send({ embeds: [alertMessage] }).then(msg => msg.react('😡'))
      //msg.channel.send(`${datalist[i].Output} <@${msg.author.id}>님!! ${msg.content}(이)라뇨!`).then(msg => msg.react('😡'));
    }

    fs.writeFileSync(filePath, JSON.stringify(saveUser));
  }
});

client.login(token);
