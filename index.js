let { MessageEmbed, Client, Intents, Collection } = require('discord.js');
let fs = require('fs');
const db = require('quick.db');
let client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Collection();

const { clientid, token } = require('./config.json');

let datajson = fs.readFileSync('data.json', 'utf-8');

let obj = JSON.parse(datajson);
let datalist = obj.datalist;
let datalist2 = obj.datalist2;

let commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

console.log('감지된 추가 명령어\n');

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  console.log(` - 이름: ${command.name}, 설명: ${command.description}`);
  client.commands.set(command.name, command);
}

const img = 'https://cdn.discordapp.com/attachments/938745566647705690/966469502692900874/ab9ac7ad6be1ac73.jpeg';

client.once('ready', () => {
  console.log(`\n${client.user.tag} (검열봇) 이 준비되었습니다!`);
  client.user.setActivity('욕설', { type: "LISTENING" });
});

client.on('messageCreate', async msg => {
  if (msg.author.bot) return;
  console.log(
    `[ ${msg.guild.name} ] "${msg.channel.name}" ${msg.member.user.username}#${msg.member.user.discriminator} : ${msg.content}`
  );

  const args = msg.content.slice(1).split(/ +/);
  const command = args.shift().toLowerCase();

  const id = msg.author.id;
  const guild = msg.guild.id;
  const warn_get = `warn.${guild}.${id}`;
  const warn = db.get(warn_get);

  if (warn == NaN) db.set(warn_get, 0);

  if (msg.content == '욕설') msg.reply('이걸 진짜로 해보네;');

  try {
    if (msg.content.startsWith('ㅁ'))
      client.commands.get(command).execute(msg, args);
  }
  catch (error) {
    if (msg.content.startsWith('ㅁ'))
      console.error(error);
  }

  for (var i = 0; i < datalist.length; i++) {
    if (msg.content.search(datalist[i].DataName) != -1) {
      console.log('욕설이 감지되었습니다!');
      if (!warn) db.set(warn_get, 1);
      else db.add(warn_get, 1);
      const alertMessage = new MessageEmbed()
        .setAuthor('검열봇', img)
        .setTitle('**⚠️ 욕설이 감지되었습니다!**')
        .setColor(0xBDBDBD)
        .setDescription(`${datalist[i].Output} <@${msg.author.id}>님!! ${msg.content}(이)라뇨!`)
        .addField('누적 경고 수', `${warn ? warn : 0} -> ${warn ? warn + 1 : 1}`);
      msg.delete();
      msg.channel.send({ embeds: [alertMessage] }).then(msg => msg.react('😡'));

      if (warn >= 100) {
        db.set(`warn.${guild}.${id}`, 0);
        msg.guild.members.ban(msg.author.id)
          .then(banInfo => console.log(`${banInfo.user?.tag ?? banInfo.tag ?? banInfo} 를 밴했습니다.`))
          .catch(console.error);
      }
      return;
    }
  }

  for (var i = 0; i < datalist2.length; i++) {
    if (msg.content.search(datalist2[i].DataName) != -1) {
      console.log('착한말이 감지되었습니다!');
      if (!warn) db.set(warn_get, 0);
      else db.add(warn_get, -1);
      const thankMessage = new MessageEmbed()
        .setAuthor('검열봇', img)
        .setTitle('**️♥️ 칭찬이 감지되었습니다!**')
        .setColor(0xBDBDBD)
        .setDescription(`${datalist2[i].Output} <@${id}>님!! ${msg.content}!! 멋진말이에요!${!warn ? '\n경고횟수가 0이기 때문에 더이상 감소가 불가능해요!' : ''}`)
        .addField('누적 경고 수', `${warn} -> ${warn ? warn - 1 : 0}`);
      msg.react('♥️');
      msg.channel.send({ embeds: [thankMessage] }).then(msg => msg.react('♥️'));
      return;
    }
  }
});

client.login(token);