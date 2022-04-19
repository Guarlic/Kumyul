let { MessageEmbed } = require('discord.js');
const img = 'https://blog.kakaocdn.net/dn/qpua2/btqyqx0g6YA/NYd5fopPNOBPwxDiYIXDK1/img.jpg';

module.exports = {
    name: "도움말",
    description: "도움말을 표시합니다.",
    execute(msg) {
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
}