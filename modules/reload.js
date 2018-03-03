module.exports = {
    name: 'reload',
    type: 'owner',
    usage: 'reload <commandname>',
    permission: 6,
    help: 'Reloads a command.',
    main: function(bot, msg) {
        if (msg.content === 'reload') return msg.channel.reply('Must provide a command name to reload.');
        if (msg.author.id !== require('../config.json').owner) return msg.channel.reply('you do not have permission to reload a command!');
        if (msg.args[0] === 'all') return null;
        delete require.cache[require.resolve(`./${msg.args[0]}.js`)];
        bot.commands.set(msg.args[0], require(`./${msg.args[0]}.js`));
        msg.reply(`the command ${msg.args[0]} has been successfully reloaded!`);
        return null;
    },
};
