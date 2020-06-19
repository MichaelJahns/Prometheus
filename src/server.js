require('dotenv').config()

const Discord = require("discord.js");
const { commandsEmbed } = require("./ui/commandsEmbed");
const { aboutEmbed } = require("./ui/aboutEmbed");

const bot = new Discord.Client();
module.exports.bot = bot;
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

const {avalon} = require('./avalon/avalon.js')
const {cleanChat} = require('./util/channelCommands');
const { assignNight } = require("./assignNight");
 
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
    case `${prefix}pickCaptains`:
      pickCaptains(msg);
      break;
    case `${prefix}cleanUp`:
      cleanChat(msg, prefix);
      break;
    case `${prefix}about`:
      aboutPrometheus(msg);
      break;
    case `${prefix}avalon`:
      avalon(msg);
      break;
    default:
      `${command} is not a known command. For a list of known commands, try <-about>`
  }
});

// About Functions
//================
function aboutPrometheus(msg) {
  msg.channel.send(aboutEmbed).then(() => {
    const filter = m => msg.author.id === m.author.id;
    msg.channel
      .awaitMessages(filter, { time: 15000, maxMatches: 1, errors: ["time"] })
      .then(messages => {
        const response = messages.first().content;
        if (response === "commands") {
          msg.channel.send(commandsEmbed);
        } else {
          msg.channel.send(`Unrecognized input.`);
        }
      })
      .catch(() => {
        msg.channel.send(`No follow up command was issued`);
        console.log(`No follow up command was issued`);
      });
  });
}