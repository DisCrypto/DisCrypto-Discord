const {exec, execSync} = require('child_process');
module.exports = {
    name: 'restart',
    type: 'owner',
    usage: 'restart',
    permission: 6,
    help: 'Restarts the bot.',
    main: async function(bot, msg) {
        console.log(`called`);
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
            await msg.channel.send(':wave: All shards of ' + bot.user.username + ' are restarting...');
            setTimeout(() => {
                bot.shard.broadcastEval('process.exit(0)');
            }, 1000);
            return null;
        } else if (msg.args[0] == "git") {
            await msg.channel.send(':wave: All shards of ' + bot.user.username + ' are restarting to git pull...');
            execSync(`git pull origin master`);
            bot.shard.broadcastEval('process.exit(0)').then(() => {
                msg.channel.send(`Resetted and pulled!`);
            }).catch(err => {msg.reply(`Error: ${err.stack}`);});
            return null;
        } else if (msg.args[0] == "pull") {
            await msg.channel.send('Pulling from git...');
            exec(`git pull origin master`, (err, stdout, stderr) =>{
                if (err || stderr) {
                    err ? msg.channel.send(err) : msg.channel.send(stderr);
                } else {
                    msg.channel.send(`Success!\n\`\`\`${stdout}\`\`\``);
                }
            });
            return null;
        } else {
            msg.channel.send(`Invalid type`);
        }
    },
};
