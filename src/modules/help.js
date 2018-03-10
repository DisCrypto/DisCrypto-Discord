const Discord = require('discord.js');
const readdirSync = require('fs').readdirSync;
let helper = {}
require('./../funcs')(helper);


const buildCommands = function() {

    const commands = {}

    commands["$"] = {
        name: "$",
        usage: "$[coin]",
        example: "$eth",
        help: "Get all price data for a certain coin - always use $ as prefix"
    };

    const files = readdirSync(srcRoot + '/modules/')

    files.forEach((file) => {
        var command = require(`./${file}`);
        if (command.type !== "owner") {
            commands[command.name] = command
        }
    });

    return commands
}

module.exports = {
    name: 'help',
    type: 'core',
    usage: 'help',
    example: 'help',
    permission: 1,
    help: 'Show help.',
    main: async function (bot, message) {
        let prefix = await bot.getPrefix(message);
        let commands = buildCommands(prefix)

        let commandName = message.args[0]

        if (commands[commandName]) {
            // help for single command
            let command = commands[commandName]
            return helper.showUsage(command, message);
        } else {
            // help for all

            let text = `\nInvite this bot to your server: <https://discordapp.com/oauth2/authorize?client_id=411996950670344234&permissions=0&scope=bot>\n\n` + 
                       `**Command List**\n` + 
                       `Use \`${prefix}help [command] \` to get more info on a specific command \n`+ 
                       `For example,  \`${prefix}help scan\`\n\n` +
                       '' +
                       '**Core** - `top` `scan` `convert` `coininfo` `$` \n' + 
                       '**Utility** - `genwallet`\n' +
                       '**Fun** - `flippening`\n' +
                       '**Management** - `invite` `ping` `setprefix` `shardinfo`\n\n' +
                       `\n\nWEBSITE: <https://discrypto.xyz>` + 
                       `\nSupport: <https://discordapp.com/invite/Xg5V8mn>` 

            let emb = new Discord.RichEmbed()
            .addField("Commands", text)
            .setColor(`GOLD`)
            .setAuthor(bot.user.username, bot.user.avatarURL);

            message.channel.send(text);

        }

    },
};
