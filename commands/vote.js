const db = require('quick.db');
const votedb = new db.table('vote');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const img = 'https://cdn.discordapp.com/attachments/938745566647705690/966469502692900874/ab9ac7ad6be1ac73.jpeg';

module.exports = {
  name: '투표',
  description: '투표를 엽니다.',
  execute(msg) {
    const id = msg.author.id;
    const name = msg.author.username;
    const discriminator = msg.author.discriminator;
    const description = msg.content.slice(4);
    let voteid = Math.random().toString(36).substr(2, 16);
    let vote_true = votedb.get(`${voteid}.${id}.true`) ? votedb.get(`${voteid}.${id}.ture`) : 0;
    let vote_false = votedb.get(`${voteid}.${id}.false`) ? votedb.get(`${voteid}.${id}.false`) : 0;
    let vote_open = true;
    votedb.set(`${voteid}.${id}.open`, true);

    let voteEmbed = new MessageEmbed()
      .setAuthor('시덱이', img)
      .setColor(0xBDBDBD)
      .setTitle(`**[ 주제 ]\n${description}**`)
      .setDescription('`찬성 : 0`\n`반대 : 0`');

    const buttons = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId(`${voteid}.true`)
          .setLabel('👍')
          .setStyle('SUCCESS'),
        new MessageButton()
          .setCustomId(`${voteid}.false`)
          .setLabel('👎')
          .setStyle('DANGER'),
        new MessageButton()
          .setCustomId(`${voteid}.lock`)
          .setLabel('🔒')
          .setStyle('SECONDARY')
      );

    msg.channel.send({
      content: `${name}#${discriminator} 님이 여신 투표에요!`,
      embeds: [voteEmbed],
      components: [buttons]
    });

    const filter = msg => {
      return msg.customId == `${voteid}.true` || msg.customId == `${voteid}.false` || msg.customId == `${voteid}.lock`;
    };

    const collector = msg.channel.createMessageComponentCollector({
      filter
    });

    const message = msg;

    msg.delete();

    collector.on('collect', async msg => {
      const id = msg.user.id;
      /*
      if (msg.customId != `${voteid}.lock` && votedb.get(`${voteid}.${id}.true`) == 1 || votedb.get(`${voteid}.${id}.false`) == 1) {
        msg.channel.send(`<@${id}> 님! 이미 투표하셨잖아요! ㅡ.ㅡ`);
        return;
      }
      */
      if (msg.customId == `${voteid}.true`) {
        if (votedb.get(`${voteid}.${id}`) != undefined) {
          if (votedb.get(`${voteid}.${id}.true`) > 0) {
            votedb.set(`${voteid}.${id}.true`, 0);
            vote_true--;

            voteEmbed = new MessageEmbed()
              .setAuthor('시덱이', img)
              .setColor(0xBDBDBD)
              .setTitle(`**[ 주제 ]\n${description}**`)
              .setDescription(`\`찬성 : ${vote_true}\`\n\`반대 : ${vote_false}\``);

            msg.update({
              content: `${name}#${discriminator} 님이 여신 투표에요!`,
              embeds: [voteEmbed],
              components: [buttons]
            });
            return;
          }
          if (votedb.get(`${voteid}.${id}.false`) > 0) {
            votedb.set(`${voteid}.${id}.false`, 0);
            votedb.add(`${voteid}.${id}.true`, 1);
            vote_false--;
            vote_true++;

            voteEmbed = new MessageEmbed()
              .setAuthor('시덱이', img)
              .setColor(0xBDBDBD)
              .setTitle(`**[ 주제 ]\n${description}**`)
              .setDescription(`\`찬성 : ${vote_true}\`\n\`반대 : ${vote_false}\``);

            msg.update({
              content: `${name}#${discriminator} 님이 여신 투표에요!`,
              embeds: [voteEmbed],
              components: [buttons]
            });
            return;
          }
        }
        vote_true++;
        votedb.add(`${voteid}.${id}.true`, 1);

        voteEmbed = new MessageEmbed()
          .setAuthor('시덱이', img)
          .setColor(0xBDBDBD)
          .setTitle(`**[ 주제 ]\n${description}**`)
          .setDescription(`\`찬성 : ${vote_true}\`\n\`반대 : ${vote_false}\``);

         msg.update({
          content: `${name}#${discriminator} 님이 여신 투표에요!`,
          embeds: [voteEmbed],
          components: [buttons]
        });
      }
      if (msg.customId == `${voteid}.false`) {
        if (votedb.get(`${voteid}.${id}`) != undefined) {
          if (votedb.get(`${voteid}.${id}.false`) > 0) {
            votedb.set(`${voteid}.${id}.false`, 0);
            vote_false--;

            voteEmbed = new MessageEmbed()
              .setAuthor('시덱이', img)
              .setColor(0xBDBDBD)
              .setTitle(`**[ 주제 ]\n${description}**`)
              .setDescription(`\`찬성 : ${vote_true}\`\n\`반대 : ${vote_false}\``);

            msg.update({
              content: `${name}#${discriminator} 님이 여신 투표에요!`,
              embeds: [voteEmbed],
              components: [buttons]
            });
            return;
          }
          if (votedb.get(`${voteid}.${id}.true`) > 0) {
            votedb.set(`${voteid}.${id}.true`, 0);
            votedb.add(`${voteid}.${id}.false`, 1);
            vote_false++;
            vote_true--;

            voteEmbed = new MessageEmbed()
              .setAuthor('시덱이', img)
              .setColor(0xBDBDBD)
              .setTitle(`**[ 주제 ]\n${description}**`)
              .setDescription(`\`찬성 : ${vote_true}\`\n\`반대 : ${vote_false}\``);

            msg.update({
              content: `${name}#${discriminator} 님이 여신 투표에요!`,
              embeds: [voteEmbed],
              components: [buttons]
            });
            return;
          }
        }
        vote_false++;
        votedb.add(`${voteid}.${id}.false`, 1);

        voteEmbed = new MessageEmbed()
          .setAuthor('시덱이', img)
          .setColor(0xBDBDBD)
          .setTitle(`**[ 주제 ]\n${description}**`)
          .setDescription(`\`찬성 : ${vote_true}\`\n\`반대 : ${vote_false}\``);

        msg.update({
          content: `${name}#${discriminator} 님이 여신 투표에요!`,
          embeds: [voteEmbed],
          components: [buttons]
        });
      }
      if (msg.customId == `${voteid}.lock`) {
        if (id != message.author.id) {
          msg.channel.send(`<@${id}> 님! 당신은 이 투표를 열지 않았잖아요! ㅡ.ㅡ`);
          return;
        }
        votedb.set(`${voteid}.${id}.open`, false);

        voteEmbed = new MessageEmbed()
          .setAuthor('시덱이', img)
          .setColor(0xBDBDBD)
          .setTitle(`**[ 주제 ]\n${description}**`)
          .setDescription(`\`찬성 : ${vote_true}\`\n\`반대 : ${vote_false}\`\n***이 투표는 종료됐어요!***`);

        vote_true = 0;
        vote_false = 0;
        vote_open = false;

        msg.update({
          content: `${name}#${discriminator} 님이 여신 투표에요!`,
          embeds: [voteEmbed],
          components: []
        });

        votedb.delete(voteid);
      }
    });
  }
}
