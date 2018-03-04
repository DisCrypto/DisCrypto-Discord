module.exports = {
    name: 'restart',
    type: 'owner',
    usage: 'restart',
    permission: 6,
    help: 'Restarts the bot.',
    main: function(bot, msg) {
        if (msg.args[0] == null || msg.args[0] == "local") {
            if (!bot.shard) {
                msg.channel.send(':wave: ' + bot.user.username + ' is restarting...');
            } else				{
                msg.channel.send(':wave: Shard ' + bot.shard.id + ' of ' + bot.user.username + ' is restarting...');
            }

            setTimeout(() => {
                process.exit();
            }, 1000);
        } else if (msg.args[0] == "global") {
            msg.channel.send(':wave: All shards of ' + bot.user.username + ' are restarting...');

            setTimeout(() => {
                bot.shard.broadcastEval('process.exit(0)');
            }, 1000);
            return null;
        } else if (msg.args[0] == "git") {
            msg.channel.send(':wave: All shards of ' + bot.user.username + ' are restarting to git pull...');

            setTimeout(() => {
                bot.shard.broadcastEval(`git pull`).then(()=> {
                    bot.shard.broadcastEval('process.exit(0)').then(() => {
                        msg.channel.send(`Resetted and pulled!`);
                    }).catch(err => {msg.reply(`Error`); console.error(err);});
                }).catch(err => {msg.reply(`Error`); console.error(err);});
            }, 1000);
            return null;
        }
    },
};
