let { MessageEmbed, Client, Intents, Collection } = require('discord.js');
let fs = require('fs');
const db = require('quick.db');
const warndb = new db.table('warn');
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
const prefix = 'ㅁ';

class Actlist {
  constructor(content, type) {
    this.content = content;
    this.type = type;
  }
};

client.once('ready', () => {
  console.log(`\n${client.user.tag} (검열봇 시덱이) 이 준비되었습니다!`);
  client.user.setActivity('욕설', { type: 'LISTENING' });
  setInterval(() => {
    const list = [
      new Actlist('욕설', 'LISTENING'),
      new Actlist('닝겐들 명령', 'LISTENING'),
      new Actlist('너님의 명령', 'LISTENING'),
      new Actlist('욕설을 검열', 'PLAYING'),
      new Actlist('시덱인 귀여웡 이라고', 'PLAYING'),
      new Actlist('당신네 서버에서 검열놀이', 'PLAYING'),
      new Actlist(`${client.guilds.cache.size}개의 서버에서 함께`, 'PLAYING'),
      new Actlist(`${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}명의 닝겐들과 함께`, 'PLAYING')
    ];

    const num = Math.floor(Math.random() * list.length);

    client.user.setActivity(list[num].content, { type: list[num].type });
  },5000)
});

client.on('messageCreate', async msg => {
  if (msg.author.bot || msg.channel.topic == 'ㅁ봇금지') return;
  console.log(
    `[ ${msg.guild.name} ] "${msg.channel.name}" ${msg.member.user.username}#${msg.member.user.discriminator} : ${msg.content}`
  );

  const args = msg.content.slice(1).split(/ +/);
  const command = args.shift().toLowerCase();

  const id = msg.author.id;
  const guild = msg.guild.id;
  const warn_get = `warn.${guild}.${id}`;
  const value_get = `value.${guild}`;
  const warn = warndb.get(warn_get);

  if (warndb.get(value_get) == undefined) warndb.set(value_get, 100);

  const value = warndb.get(value_get);

  if (warn >= value) {
    warndb.set(`warn.${guild}.${id}`, 0);

    const perms = msg.member.permissions;
    if (perms.has('ADMINISTARTOR')) {
      msg.channel.send(`음.. <@${id}> 님은 관리자라서 밴을 못하겠어요..`);
      return;
    }

    msg.channel.send(`경고가 ${value} 회가 넘어 <@${id}> 님이 밴 되었습니다!`);
    msg.guild.members.ban(msg.author.id)
      .then(banInfo => console.log(`${banInfo.user?.tag ?? banInfo.tag ?? banInfo} 를 밴했습니다.`))
      .catch(console.error);
  }

  if (warn == NaN) warndb.set(warn_get, 0);

  if (msg.content == '욕설') msg.reply('이걸 진짜로 해보네;');

  if (msg.channel.topic != 'ㅁ검열무시') {
    for (var i = 0; i < datalist.length; i++) {
      if (msg.content.search(datalist[i].DataName) != -1) {
        console.log('욕설이 감지되었습니다!');
        if (!warn) warndb.set(warn_get, 1);
        else warndb.add(warn_get, 1);
        const alertMessage = new MessageEmbed()
          .setAuthor('시덱이', img)
          .setTitle('**⚠️ 욕설이 감지되었습니다!**')
          .setColor(0xBDBDBD)
          .setDescription(`${datalist[i].Output} <@${msg.author.id}>님!! ${msg.content}(이)라뇨!`)
          .addField('누적 경고 수', `${warn ? warn : 0} -> ${warn ? warn + 1 : 1}`);
        msg.delete();
        msg.channel.send({ content: `<@${id}>! 이의있소!`, embeds: [alertMessage] }).then(msg => msg.react('😡'));
        return;
      }
    }

    for (var i = 0; i < datalist2.length; i++) {
      if (msg.content.search(datalist2[i].DataName) != -1) {
        console.log('착한말이 감지되었습니다!');
        if (!warn) warndb.set(warn_get, 0);
        else warndb.add(warn_get, -1);
        const thankMessage = new MessageEmbed()
          .setAuthor('시덱이', img)
          .setTitle('**️♥️ 칭찬이 감지되었습니다!**')
          .setColor(0xBDBDBD)
          .setDescription(`${datalist2[i].Output} <@${id}>님!! ${msg.content}!! 멋진말이에요!${!warn ? '\n경고횟수가 0이기 때문에 더이상 감소가 불가능해요!' : ''}`)
          .addField('누적 경고 수', `${warn ? warn : 0} -> ${warn ? warn - 1 : 0}`);
        msg.react('♥️');
        msg.reply({ embeds: [thankMessage] }).then(msg => msg.react('♥️'));
        return;
      }
    }
  }

  if (msg.content.startsWith('꺠미야')) msg.reply('전 시덱이거든요!!');
  if (msg.content == '시덱아 꺠미') msg.reply('걘 너무 장난기가 많아요!! 이름도 개미인게 징그러워가지곤. 저보고 칙칙하다 하지 뭐에요? 아! 호두같은건 인정할게요! 제가 좀 고소하고 담백하긴 하죠 ㅎㅎ');

  if (!client.commands.has(command) || !msg.content.startsWith(prefix)) return;

  try { client.commands.get(command).execute(client, msg, args); }
  catch (error) { console.error(error); }
});

client.login(token);
