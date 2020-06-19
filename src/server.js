const Discord = require("discord.js");
const firebase = require("firebase/app");
const firestore = require("firebase/firestore");
const { firebaseConfig } = require("./firebase/config.js");
const { commandsEmbed } = require("./ui/commandsEmbed");
const { aboutEmbed } = require("./ui/aboutEmbed");

const bot = new Discord.Client();
require("./util/eventLoader")(bot);
const prefix = "-";
exports.prefix = prefix;

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


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

// Team Captain Functions
//=======================
function pickCaptains(msg) {
  if (msg.member.voiceChannel === undefined) {
    msg.channel.send(`You must be in a voice channel to use this command.`);
    return;
  }
  let contestants = collectVoiceChannelParticipantsIDs(msg.member.voiceChannel);
  if (contestants.length >= 2) {
    const ticketOne = randomNumberInRange(contestants.length);
    const captainOne = contestants.splice(ticketOne, 1);
    const ticketTwo = randomNumberInRange(contestants.length);
    const captainTwo = contestants.splice(ticketTwo, 1);
    msg.channel.send(
      `Let ${captainOne} and ${captainTwo} be the team captains this game.`
    );
  } else {
    msg.channel.send(`${msg.author} you are alone in that call.`);
  }
}

// Night Assignment Functions
//===========================
function assignNight(msg) {
  // Return is sender is not an active participant in the voice chat
  if (msg.member.voiceChannel === undefined) {
    msg.channel.send(`You must be in a voice channel to use this command.`);
    return;
  }
  let date = new Date().toDateString();
  isNightOwned(date, msg);
}

function isNightOwned(date, msg) {
  return db
    .collection("night")
    .doc(date)
    .get()
    .then(function (doc) {
      if (doc.exists) {
        // Night is already owned, the dice will not roll again
        msg.channel.send(
          `I have already decided that it is ${doc.data().nightOwner}'s night.`
        );
      } else {
        // Night is not owned, a member will be selected at random from the same voice chat as the orginal messages author
        msg.channel.send(`Tonight has not yet been assigned.`);
        assignNightRandomly(date, msg);
      }
    })
    .catch(function (error) {
      console.log("Error getting document" + error);
    });
}

function assignNightRandomly(date, msg) {
  //get all users in voiceChannel
  let contestants = collectVoiceChannelParticipantsIDs(msg.member.voiceChannel);
  //make a winning number and assign to a user
  const goldenTicket = randomNumberInRange(contestants.length);
  const lottoWinner = contestants[goldenTicket];
  // return that user and declare that it is their night
  writeNight(lottoWinner, date, msg);
}

function writeNight(lottoWinner, date, msg) {
  return db
    .collection("night")
    .doc(date)
    .set({
      nightOwner: lottoWinner
    })
    .then(function (docRef) {
      msg.channel.send(`Let tonight be ${lottoWinner}'s night.`);
      console.log(`Night Owner ${lottoWinner} written to firestore`);
    })
    .catch(function (error) {
      msg.channel.send(`Failed to assign night..`);
      console.log(`Failure to write ${lottoWinner} to firestore`);
    });
}