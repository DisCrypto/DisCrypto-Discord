const Discord = require('discord.js');
const readdirSync = require('fs').readdirSync;


const buildCommands = function() {

    const commands = {};

    commands["$"] = {
        name: "$",
        usage: "$[coin]",
        example: "$eth",
        help: "Get all price data for a certain coin - always use $ as prefix"
    };

    const files = readdirSync(srcRoot + '/modules/');

    files.forEach((file) => {
        var command = require(`./${file}`);
        if (command.type !== "owner") {
            commands[command.name] = command;
        }
    });

    return commands;
};

const commands = buildCommands();

module.exports = {
    name: 'help',
    type: 'core',
    usage: 'help',
    example: 'help',
    permission: 1,
    help: 'Show help.',
    main: async function (bot, message) {
        let prefix = await bot.getPrefix(message);

        let commandName = message.args[0];

        if (commandName && commands[commandName]) {
            // help for single command
            let command = commands[commandName];
            return bot.showUsage(command, message);
        } else {
            // help for all
            let gName = "";
            message.guild ? gName = message.guild.name : gName = `This DM`;
            if (gName !== "This DM" && message.args[0] && message.args[0].toLowerCase() === 'dm') gName = 'This DM';

            if (gName == "This DM")  message.channel.send(`Sending you commands in DM...`);

            let text = `**${gName}'s prefix is ${prefix}**\n\n` +
                       `\nInvite this bot to your server [here](https://discordapp.com/oauth2/authorize?client_id=411996950670344234&permissions=16384&scope=bot)\n\n` +
                       `\nUpvote the bot on DBL [here](https://discordbots.org/bot/411996950670344234/vote)` +
                       `\n**Command List**\n` +
                       `Use \`help [command] \` to get more info on a specific command \n`+
                       `For example,  \`help scan\`\n\n` +
                       '**Core** - `top` `scan` `convert` `coininfo` `$` \n' +
                       '**Fun** - `flippening` `shitcoin`\n' +
                       '**Management** - `invite` `upvote` `ping` `setprefix` `stats` \n\n' +
                       `WEBSITE: <http://discrypto.xyz>` +
                       `\nSupport: <http://discordapp.com/invite/Xg5V8mn>`;

            let emb = new Discord.RichEmbed()
                .setColor(`GOLD`)
                .setAuthor(bot.user.username, bot.user.avatarURL)
                .setDescription(text);

            if (gName == "This DM") message.author.send(emb);
            else message.channel.send(emb);

        }

    },
};
