const { MessageEmbed } = require('discord.js');
const img = 'https://cdn.discordapp.com/attachments/938745566647705690/966469502692900874/ab9ac7ad6be1ac73.jpeg';

module.exports = {
  name: '도움말',
  description: '도움말을 표시합니다.',
  execute(msg) {
    const after = msg.content.slice(5);
    let helpMessage = new MessageEmbed();

    if (after == '' || after == '도움말') {
      helpMessage = new MessageEmbed()
        .setAuthor('시덱이', img)
        .setTitle('**📜 도움말**')
        .setColor(0xBDBDBD)
        .addFields(
          { name: '도움말', value: 'ㅁ도움말 -> 도움말 전체\nㅁ도움말 명령어 -> 명령어의 도움말\n를 표시합니다.' },
          { name: '경고 증가, 차감', value: '욕설 사용 시 경고가 증가되고, 좋은 단어 사용 시 경고가 차감됩니다.' },
          { name: '경고수', value: 'ㅁ경고수 -> 본인의 경고수\nㅁ경고수 @유저 -> 유저의 경고수\n를 표시합니다.' },
          { name: '경고', value: 'ㅁ경고 -> ㅁ경고 @유저 개수 로 수동으로 경고 추가 가능합니다.' },
          { name: '경고차감', value: 'ㅁ경고차감 -> ㅁ경고차감 @유저 개수 로 수동으로 경고 차감 가능합니다.' },
          { name: '경고 초기화', value: 'ㅁ경고초기화 @유저 -> 유저의 경고를 초기화합니다.' },
          { name: '경고 지정', value: 'ㅁ경고지정 @유저 숫자 -> 유저의 경고를 지정합니다.'},
          { name: '한도확인', value: 'ㅁ한도확인 -> 이 서버의 경고 한도를 출력합니다.'},
          { name: '한도설정', value: 'ㅁ한도설정 숫자 -> 이 서버의 경고 한도를 변경합니다.'},
          { name: '투표', value: 'ㅁ투표 주제 -> 주제의 관한 투표를 시작합니다.'}
        );
    }
    else if (after == '경고 증감' || after == '경고' || after == '경고차감') {
      helpMessage = new MessageEmbed()
        .setAuthor('시덱이', img)
        .setTitle('**📜 도움말**')
        .setColor(0xBDBDBD)
        .addField('경고 증가, 차감', '욕설 사용 시 경고가 증가되고, 좋은 단어 사용 시 경고가 차감됩니다.\n(수동으로도 가능합니다)');
    }
    else if (after == '경고수') {
      helpMessage = new MessageEmbed()
        .setAuthor('시덱이', img)
        .setTitle('**📜 도움말**')
        .setColor(0xBDBDBD)
        .addField('경고수', 'ㅁ경고수 -> 본인의 경고수\nㅁ경고수 @유저 -> 유저의 경고수\n를 표시합니다.');
    }
    else if (after == '경고 초기화') {
      helpMessage = new MessageEmbed()
        .setAuthor('시덱이', img)
        .setTitle('**📜 도움말**')
        .setColor(0xBDBDBD)
        .addField('경고 초기화', 'ㅁ경고초기화 @유저 -> 유저의 경고를 초기화합니다.');
    }
    else if (after == '경고 지정') {
      helpMessage = new MessageEmbed()
        .setAuthor('시덱이', img)
        .setTitle('**📜 도움말**')
        .setColor(0xBDBDBD)
        .addField('경고 지정', 'ㅁ경고지정 @유저 숫자 -> 유저의 경고를 지정합니다.');
    }
    else if (after == '한도확인') {
      helpMessage = new MessageEmbed()
        .setAuthor('시덱이', img)
        .setTitle('**📜 도움말**')
        .setColor(0xBDBDBD)
        .addField('한도확인', 'ㅁ한도확인 -> 이 서버의 경고 한도를 출력합니다.');
    }
    else if (after == '한도설정') {
      helpMessage = new MessageEmbed()
        .setAuthor('시덱이', img)
        .setTitle('**📜 도움말**')
        .setColor(0xBDBDBD)
        .addField('한도설정', 'ㅁ한도설정 숫자 -> 이 서버의 경고 한도를 변경합니다.');
    }
    else if (after == '투표') {
      helpMessage = new MessageEmbed()
        .setAuthor('시덱이', img)
        .setTitle('**📜 도움말**')
        .setColor(0xBDBDBD)
        .addField('투표', 'ㅁ투표 주제 -> 주제의 관한 투표를 시작합니다.');
    }
    else {
      msg.reply('어.. ㅁ도움말 이라고 해볼래요?');
      return;
    }

    msg.reply({ embeds: [helpMessage] });
  }
}
