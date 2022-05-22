module.exports = {
  name: '청소',
  description: '메시지를 청소합니다.',
  async execute(client, msg, args) {
    const perms = msg.member.permissions;
    if (!perms.has('MANAGE_MESSAGES')) {
      msg.reply('이 명령어를 사용하려면 메시지 관리 권한이 필요해요!');
      return;
    }

    const count = Number(msg.content.slice(4));
    const channel = msg.channel;

    if (count < 0 || count > 101) {
      msg.reply('한번에 1에서 100개까지만 지울 수 있어요!');
      return;
    }

    await channel.bulkDelete(count + 1).then(msg => channel.send(`성공적으로 ${count} 개의 메시지를 지웠어요!`).then(msg => setTimeout(() => { msg.delete() }, 5000)));
  }
}
