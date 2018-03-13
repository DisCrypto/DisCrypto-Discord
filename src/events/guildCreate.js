const Discord = require('discord.js');

exports.run = (bot, guild) => {

    let emb = new Discord.RichEmbed();
    let description = `
    My default prefix here is \`%\`.\n
You can see a list of commands by typing \`%help\`.\n
You can change my prefix with \`%setprefix <newprefix>\`.\n
If you need help, feel free to join our support server at https://discord.gg/Xg5V8mn \n
If you like my features, I'd really appreciate a free and quick upvote on our Bot List over [here](https://discordbots.org/bot/411996950670344234)!`;

    emb.setTitle("Thank you for adding me!")
        .setColor(`#00FF00`)
        .setDescription(description);
    bot.addServer(guild);
    guild.channels.get(guild.channels.filter(c => c.type === 'text').map(c => c.id)[0]).send(emb).catch(() => {
        guild.owner.send(emb);
    });
};
