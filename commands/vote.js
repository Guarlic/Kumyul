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
    const description = msg.content.slice(4);
    const voteid = Math.random().toString(36).substr(2, 16);
    let vote_true = votedb.get(`${voteid}.${id}.true`) ? votedb.get(`${voteid}.${id}.ture`) : 0;
    let vote_false = votedb.get(`${voteid}.${id}.false`) ? votedb.get(`${voteid}.${id}.false`) : 0;

    let voteEmbed = new MessageEmbed()
      .setAuthor('시덱이', img)
      .setColor(0xBDBDBD)
      .setTitle(`**[ 주제 : ${description} ]**`)
      .setDescription('`찬성 : 0`\n`반대 : 0`');

    const buttons = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('true')
          .setLabel('👍')
          .setStyle('SUCCESS'),
        new MessageButton()
          .setCustomId('false')
          .setLabel('👎')
          .setStyle('DANGER')
      );

    msg.channel.send({ content: `${name} 님이 여신 투표에요!`, embeds: [voteEmbed], components: [buttons] });

    const collector = msg.channel.createMessageComponentCollector({
      time: 600 * 1000
    });

    const message = msg;

    collector.on('collect', async msg => {
      if (msg.customId == 'true') {
        if (votedb.get(`${voteid}.${id}`) != undefined) {
          if (votedb.get(`${voteid}.${id}.true`) > 0) {
            await msg.channel.send(`<@${id}> 님! 부정투표는 불가능해요!`);
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
              .setTitle(`**[ 주제 : ${description} ]**`)
              .setDescription(`\`찬성 : ${vote_true}\`\n\`반대 : ${vote_false}\``);

            msg.update({
              content: `${name} 님이 여신 투표에요!`,
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
          .setTitle(`**[ 주제 : ${description} ]**`)
          .setDescription(`\`찬성 : ${vote_true}\`\n\`반대 : ${vote_false}\``);

        msg.update({
          content: `${name} 님이 여신 투표에요!`,
          embeds: [voteEmbed],
          components: [buttons]
        });
      }
      else {
        if (votedb.get(`${voteid}.${id}`) != undefined) {
          if (votedb.get(`${voteid}.${id}.false`) > 0) {
            await msg.channel.send(`<@${id}> 님! 부정투표는 불가능해요!`);
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
              .setTitle(`**[ 주제 : ${description} ]**`)
              .setDescription(`\`찬성 : ${vote_true}\`\n\`반대 : ${vote_false}\``);

            msg.update({
              content: `${name} 님이 여신 투표에요!`,
              embeds: [voteEmbed],
              components: [buttons]
            });
          }
          return;
        }
        vote_false++;
        votedb.add(`${voteid}.${id}.false`, 1);

        voteEmbed = new MessageEmbed()
          .setAuthor('시덱이', img)
          .setColor(0xBDBDBD)
          .setTitle(`**[ 주제 : ${description} ]**`)
          .setDescription(`\`찬성 : ${vote_true}\`\n\`반대 : ${vote_false}\``);

        msg.update({
          content: `${name} 님이 여신 투표에요!`,
          embeds: [voteEmbed],
          components: [buttons]
        });
      }
    });
  }
}
