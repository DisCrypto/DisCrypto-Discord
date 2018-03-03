exports.run = (bot, msg) => {
    if (msg.channel.type === 'dm' && msg.author.id === bot.user.id) {
        console.log('[DM] ' + bot.user.username + ' -> ' + msg.channel.recipient.username + ' | ' + msg.content);
    } else if (msg.channel.type === 'dm' && msg.author.id !== bot.user.id) {
        console.log('[DM] ' + msg.channel.recipient.username + ' -> ' + bot.user.username + ' | ' + msg.content);
    }

    if (!msg.channel.type === 'text' || !msg.guild) return;

    bot.processMessage(msg);
};
