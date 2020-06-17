const Discord = require("discord.js");

const {
  assignNight,
  pickCaptains,
  cleanUpBotMessages,
  aboutPrometheus
} = require("./src/prometheus.js");
const { avalonStart } = require("./src/avalon.js");

const bot = new Discord.Client();
require("./util/eventLoader")(bot);

const prefix = "-";

bot.on("ready", async () => {
  console.log(`${bot.user.tag} is live.`);
  bot.user.setStatus("available");
  bot.user.setPresence({
    game: {
      name: "paint dry",
      type: "WATCHING",
      url: " "
    }
  });
  try {
    let link = await bot.generateInvite(["ADMINISTRATOR"]);
    console.log(link);
  } catch (error) {
    console.log(error);
  }
});
bot.login(process.env.DISCORD_BOT_TOKEN);
// listen for commands
bot.on("message", async msg => {
  if (msg.author.bot) return;
  if (msg.channel.type === "dm") return;

  let splitMessage = msg.content.split(" ");
  let command = splitMessage[0];

  if (!command.startsWith(prefix)) return;
  switch (command) {
    case `${prefix}assignNight`:
      assignNight(msg);
      break;
    case `${prefix}avalon`:
      avalonStart(msg);
      break;
    case `${prefix}about`:
      aboutPrometheus(msg);
      break;
    case `${prefix}pickCaptains`:
      pickCaptains(msg);
    case `${prefix}cleanUp`:
      cleanUpBotMessages(msg);
      break;

    default:
      msg.channel.send(
        `${command} is not a known command. For a list of known commands, try <-about>`
      );
  }
});

// BOT utility functions
module.exports = function directMessageAvalonRole(discordID, role) {
  bot.fetchUser(discordID).then(user => {
    user.send(
      `In the coming battle of Wits you will represent, ${role.name}, a ${role.description}`
    );
  });
};
