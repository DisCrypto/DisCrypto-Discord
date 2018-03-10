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

            let text = `**Command List**\n\nUse ${prefix}help [command] to get more info on a specific command\n\n` +
                       '' +
                       '**Core** - `top` `convert` `coininfo` `$` \n' + 
                       '**Utility** - `genwallet`\n' +
                       '**Fun** - `flippening`\n' +
                       '**Management** - `invite` `ping` `setprefix` `shardinfo`\n'

            let emb = new Discord.RichEmbed()
            .addField("Commands", text)
            .setColor(`GOLD`)
            .setAuthor(bot.user.username, bot.user.avatarURL);

            message.channel.send(text);

        }

    },
};
