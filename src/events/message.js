exports.run = (bot, msg) => {
    bot.handleMessage(msg, bot, null).catch((err) => {
      console.log(err);
    });
};
