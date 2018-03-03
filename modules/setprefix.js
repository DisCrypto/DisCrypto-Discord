module.exports = {
    name: 'setprefix',
    type: 'core',
    usage: 'setprefix <newprefix>',
    permission: 4,
    help: 'Sets the prefix for the server.',
    main: function(bot, msg) {
        if (!msg.member.hasPermission('MANAGE_GUILD') && !msg.author.id === bot.config.owner) return msg.reply("you do not have permission to change this server's prefix!");
        if (msg.content.trim().length > 10) return msg.channel.send('That prefix is too long! Limit is 10 characters.');
        if (msg.content.trim().indexOf(' ') > -1) return msg.channel.send('The prefix cannot contain spaces!');

        var prefix = bot.setPrefix(msg.content.trim(), msg.guild);
        if (prefix !== undefined) {
            msg.channel.send('Server prefix successfully set to `' + prefix + '`!');
        }
        return null;
    },
};
