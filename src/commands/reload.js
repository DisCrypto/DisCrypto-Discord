module.exports = {
    name: 'reload',
    type: 'owner',
    usage: 'reload [commandname]',
    permission: 6,
    help: 'Reloads a command.',
    main: function(bot, msg) {
        try {
            if (msg.content === 'reload') return bot.showUsage(this, msg);
            else if (bot.permLevel(msg) != 6) return msg.channel.send('you do not have permission to reload a command!');
            else if (msg.args[0] === 'all') return null;
            delete require.cache[require.resolve(`./${msg.args[0]}.js`)];
            bot.commands.set(msg.args[0], require(`./${msg.args[0]}.js`));
            console.log(`test`);
            msg.reply(`the command ${msg.args[0]} has been successfully reloaded!`);
            return null;
        } catch(e) {
            msg.channel.send(`Reload failed.`);
            console.error(e);
        }
    },
};
