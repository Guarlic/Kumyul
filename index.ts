let { MessageEmbed, Client, Intents, Collection } = require('discord.js');
let fs = require('fs');
let client = new Client({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES ] });
client.commands = new Collection();

const { clientid, token } = require('./config.json');

let datajson = fs.readFileSync('data.json', 'utf-8');

let obj = JSON.parse(datajson);
let datalist = obj.datalist;
let datalist2 = obj.datalist2;

const img = 'https://blog.kakaocdn.net/dn/qpua2/btqyqx0g6YA/NYd5fopPNOBPwxDiYIXDK1/img.jpg';

client.once('ready', () => {
  console.log(`${client.user.tag} (검열봇) 이 준비되었습니다!`);
  client.user.setActivity('욕설', { type: "LISTENING" });
});

client.on('messageCreate', async msg => {
  if (msg.author.bot) return;
  console.log(
    `[ ${msg.guild.name} ] "${msg.channel.name}" ${msg.member.user.username}#${msg.member.user.discriminator} : ${msg.content}`
  );

  const id = msg.author.id;
  const filePath = `data/<@${id}>.json`;

  !fs.existsSync(filePath) ? fs.writeFileSync(filePath, JSON.stringify({})) : null;
  const user = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  let saveUser = {};

  if (user.warn == NaN) user.warn = 0;

  if (msg.content == 'ㅁ도움말') {
    const helpMessage = new MessageEmbed()
      .setAuthor('검열봇', img)
      .setTitle('**📜 도움말**')
      .setColor(0xBDBDBD)
      .addFields(
        {name: '경고 증가, 차감', value: '욕설 사용 시 경고가 증가되고, 좋은 단어 사용 시 경고가 차감됩니다.'},
        {name: '경고수', value: 'ㅁ경고수 -> 본인의 경고수\nㅁ경고수 @유저 -> 유저의 경고수\n를 표시합니다.'}
      );
    msg.channel.send({ embeds: [helpMessage] });
  }

  if (msg.content.startsWith('ㅁ경고수')) {
    const temp = msg.content.slice(5);
    const _filePath = `data/${temp}.json`;

    if (temp == '') {
      const answerMessage = new MessageEmbed()
        .setAuthor('검열봇', img)
        .setTitle('**⚠️ 경고 수**')
        .setColor(0xBDBDBD)
        .setDescription(`**현재 <@${msg.author.id}> 님의 경고 횟수입니다!**`)
        .addField('누적 경고수', `${!user.warn ? '당신은 현재 경고가 없습니다!' : user.warn}`);
      msg.channel.send({ embeds: [answerMessage] });
      return;
    }

    if (temp.startsWith('<@&') || !temp.startsWith('<@') && !temp.endsWith('>')) {
      const answerMessage = new MessageEmbed()
        .setAuthor('검열봇', img)
        .setTitle('**⚠️ 경고 수**')
        .setColor(0xBDBDBD)
        .setDescription(`**${temp} (이)라는 유저는 존재하지 않습니다!**`);
      msg.channel.send({ embeds: [answerMessage] });
      return;
    }

    if (!fs.existsSync(_filePath)) {
      const answerMessage = new MessageEmbed()
        .setAuthor('검열봇', img)
        .setTitle('**⚠️ 경고 수**')
        .setColor(0xBDBDBD)
        .setDescription(`**현재 ${temp} 님의 경고 횟수입니다!**`)
        .addField('누적 경고수', `${temp != `<@${msg.author.id}>` ? `${temp} 님은 현재 경고가 없습니다!` : '당신은 현재 경고가 없습니다!' }`);
      msg.channel.send({ embeds: [answerMessage] });
      fs.writeFileSync(_filePath, JSON.stringify({warn: 0}));
      return;
    }

    const _user = JSON.parse(fs.readFileSync(_filePath, 'utf-8'));

    const answerMessage = new MessageEmbed()
      .setAuthor('검열봇', img)
      .setTitle('**⚠️ 경고 수**')
      .setColor(0xBDBDBD)
      .setDescription(`**현재 ${temp} 님의 경고 횟수입니다!**`)
      .addField('누적 경고수', `${temp != `<@${msg.author.id}>` ? `${_user.warn ? _user.warn : `현재 ${temp} 님은 경고가 없습니다!`}` : `${_user.warn ? _user.warn : `당신은 현재 경고가 없습니다!`}`}`);
    msg.channel.send({ embeds: [answerMessage] });
  }

  if (msg.content == '욕설') {
    msg.reply('이걸 진짜로 해보네;');
  }

  for (var i = 0; i < datalist.length; i++) {
    if (msg.content.search(datalist[i].DataName) != -1) {
      console.log('욕설이 감지되었습니다!');
      if (!user.warn) saveUser = {warn: 1};
      else saveUser = {warn: user.warn + 1};
      fs.writeFileSync(filePath, JSON.stringify(saveUser));
      const alertMessage = new MessageEmbed()
        .setAuthor('검열봇', img)
        .setTitle('**⚠️ 욕설이 감지되었습니다!**')
        .setColor(0xBDBDBD)
        .setDescription(`${datalist[i].Output} <@${msg.author.id}>님!! ${msg.content}(이)라뇨!`)
        .addField('누적 경고 수', `${user.warn ? user.warn : 0} -> ${user.warn ? user.warn + 1 : 1}`);
      msg.delete();
      msg.channel.send({ embeds: [alertMessage] }).then(msg => msg.react('😡'));

      if (user.warn >= 100) {
        msg.guild.members.ban(msg.author.id)
          .then(banInfo => console.log(`${banInfo.user?.tag ?? banInfo.tag ?? banInfo} 를 밴했습니다.`))
          .catch(console.error);
        saveUser = {warn: 0}
        fs.writeFileSync(filePath, JSON.stringify(saveUser));
      }
      return;
    }
  }
  
  for (var i = 0; i < datalist2.length; i++) {
    if (msg.content.search(datalist2[i].DataName) != -1) {
      console.log('착한말이 감지되었습니다!');
      if (!user.warn) saveUser = {warn: 0};
      else saveUser = {warn: user.warn - 1};
      fs.writeFileSync(filePath, JSON.stringify(saveUser));
      const thankMessage = new MessageEmbed()
        .setAuthor('검열봇', img)
        .setTitle('**️♥️ 칭찬이 감지되었습니다!**')
        .setColor(0xBDBDBD)
        .setDescription(`${datalist2[i].Output} <@${msg.author.id}>님!! ${msg.content}!! 멋진말이에요!${!user.warn ? '\n경고횟수가 0이기 때문에 더이상 감소가 불가능해요!' : ''}`)
        .addField('누적 경고 수', `${user.warn} -> ${user.warn ? user.warn - 1 : 0}`);
      msg.react('♥️');
      msg.channel.send({ embeds: [thankMessage] }).then(msg => msg.react('♥️'));
      return;
    }
  }
});

client.login(token);