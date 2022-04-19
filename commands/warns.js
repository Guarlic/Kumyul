let fs = require('fs');
let { MessageEmbed } = require('discord.js');
const img = 'https://blog.kakaocdn.net/dn/qpua2/btqyqx0g6YA/NYd5fopPNOBPwxDiYIXDK1/img.jpg';

module.exports = {
    name: "경고수",
    description: "경고수를 표시합니다.",
    execute(msg) {
        const id = msg.author.id;
        const filePath = `./data/<@${id}>.json`;
        const user = fs.readFileSync(filePath, 'utf-8');
        const temp = msg.content.slice(5);
        const _filePath = `data/${temp}.json`;

        if (temp == '') {
            const answerMessage = new MessageEmbed()
                .setAuthor('검열봇', img)
                .setTitle('**⚠️ 경고 수**')
                .setColor(0xBDBDBD)
                .setDescription(`**현재 <@${id}> 님의 경고 횟수입니다!**`)
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
                .addField('누적 경고수', `${temp != `<@${id}>` ? `${temp} 님은 현재 경고가 없습니다!` : '당신은 현재 경고가 없습니다!' }`);
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
            .addField('누적 경고수', `${temp != `<@${id}>` ? `${_user.warn ? _user.warn : `현재 ${temp} 님은 경고가 없습니다!`}` : `${_user.warn ? _user.warn : `당신은 현재 경고가 없습니다!`}`}`);
        msg.channel.send({ embeds: [answerMessage] });
    }
}