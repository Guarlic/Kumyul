const { MessageEmbed } = require('discord.js');
const img = 'https://blog.kakaocdn.net/dn/qpua2/btqyqx0g6YA/NYd5fopPNOBPwxDiYIXDK1/img.jpg';

module.exports = {
  name: "도움말",
  description: "도움말을 표시합니다.",
  execute(msg) {
    const after = msg.content.slice(5);
    let helpMessage = new MessageEmbed();

    if (after == '' || after == '도움말') {
      helpMessage = new MessageEmbed()
        .setAuthor('검열봇', img)
        .setTitle('**📜 도움말**')
        .setColor(0xBDBDBD)
        .addFields(
          { name: '도움말', value: 'ㅁ도움말 -> 도움말 전체\nㅁ도움말 명령어 -> 명령어의 도움말\n를 표시합니다.' },
          { name: '경고 증가, 차감', value: '욕설 사용 시 경고가 증가되고, 좋은 단어 사용 시 경고가 차감됩니다.' },
          { name: '경고수', value: 'ㅁ경고수 -> 본인의 경고수\nㅁ경고수 @유저 -> 유저의 경고수\n를 표시합니다.' },
          { name: '경고', value: 'ㅁ경고 -> ㅁ경고 @유저 개수 로 수동으로 경고 추가 가능합니다.' },
          { name: '경고차감', value: 'ㅁ경고차감 -> ㅁ경고차감 @유저 개수 로 수동으로 경고 차감 가능합니다.' }
        );
    }
    else if (after == '경고 증감') {
      helpMessage = new MessageEmbed()
        .setAuthor('검열봇', img)
        .setTitle('**📜 도움말**')
        .setColor(0xBDBDBD)
        .addField('경고 증가, 차감', '욕설 사용 시 경고가 증가되고, 좋은 단어 사용 시 경고가 차감됩니다.\n(수동으로도 가능합니다)');
    }
    else if (after == '경고수') {
      helpMessage = new MessageEmbed()
        .setAuthor('검열봇', img)
        .setTitle('**📜 도움말**')
        .setColor(0xBDBDBD)
        .addField('경고수', 'ㅁ경고수 -> 본인의 경고수\nㅁ경고수 @유저 -> 유저의 경고수\n를 표시합니다.');
    }

    msg.reply({ embeds: [helpMessage] });
  }
}