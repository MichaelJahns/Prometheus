const reqEvent = event => require(`../events/${event}`);
module.exports = bot => {
  bot.on("reconnecting", () => reqEvent("reconnecting")(bot));
};
