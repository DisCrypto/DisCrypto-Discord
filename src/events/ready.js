exports.run = async bot => {
    bot.sendServerCount();
    let wallet = await bot.syncServers().catch((err) => {
        console.log(err);
        process.exit(1);
    });
    bot.startGameCycle();
    delete require.cache[require.resolve(`../commands/reset.js`)]; //seriously idk why but it always needs to be reloaded
    bot.commands.set('reset', require(`../commands/reset.js`));

    bot.log(`${bot.user.username} is online and ready to serve in ${bot.channels.size} channels on ${bot.guilds.size} servers!`);

    if (process.argv[2] && process.argv[2] === '--travis') process.exit(0);
};
