const Discord = require('discord.js');
const readdirSync = require('fs').readdirSync;

const buildCommands = function() {
    const commands = []

    let coinCommand = {
        usage: "[coin]",
        example: "$eth",
        help: "Get all price data for a certain coin - always use $ as prefix"
    };

    commands.push(coinCommand);

    const files = readdirSync('./modules/')
    files.forEach((file) => {
        debugger
        var commandMetadata = require(`./${file}`);
        commands.push({
            usage: commandMetadata.usage,
            example: commandMetadata.example,
            help: commandMetadata.help
        })
    });

    return commands
}

module.exports = {
    name: 'help',
    type: 'core',
    usage: 'help',
    example: 'help',
    permission: 1,
    help: 'List commands.',
    main: async function (bot, message) {
        let prefix = await bot.getPrefix(message);

        let emb = new Discord.RichEmbed()
            .setDescription(`The prefix for this server is **${prefix}**`)

        buildCommands().forEach((command) => {
            emb.addField(command.usage, command.help)
        });

            // .addField(`Price Info`, '`$[coin]` ex: $btc\n`top [num]` ex: top 5\n`convert [amount] [from] [to])` ex: convert 5 btc xmr',true)
            // .addField(`Utility`, '`genwallet [BTC, ETH, LTC, XRP, BCH]` ex: genwallet btc\n`coininfo [coin]` \n`invite`',true)
            // .addField(`Fun`, '`flippening`\n')
            // .addField(`Management Commands`, '`ping`\n`setprefix`\n`shardinfo`', true)
            // .setColor(`GOLD`)

        emb.setAuthor(bot.user.username, bot.user.avatarURL);
        message.channel.send(emb);
    },
};
