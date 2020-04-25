const Discord = require("discord.js");
const firebase = require("firebase/app");
const firestore = require("firebase/firestore");
const { firebaseConfig } = require("./config.js");
const { aboutEmbed, commandsEmbed } = require("./embeds.js");

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
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// listen for commands

bot.on("message", async msg => {
  if (msg.author.bot) return;
  if (msg.channel.type === "dm") return;

  let splitMessage = msg.content.split(" ");
  let command = splitMessage[0];

  if (!command.startsWith(prefix)) return;
  else if (command === `${prefix}assignNight`) {
    assignNight(msg);
  } else if (command === `${prefix}pickCaptains`) {
    pickCaptains(msg);
  } else if (command === `${prefix}cleanUp`) {
    cleanUpBotMessages(msg);
  } else if (command === `${prefix}about`) {
    aboutPrometheus(msg);
  } else if (command === `${prefix}avalon`) {
    avalonStart(msg);
  } else if (command === `${prefix}test`) {
    test(msg);
  } else {
    msg.channel.send(
      `${command} is not a known command. For a list of known commands, try <-about>`
    );
  }
});

function broadcast(msg) {
  msg.channel.send("My message to react to.").then(sentMessage => {
    sentMessage.react("👍");
    sentMessage.react("<emoji id>");
  });
}

function avalonStart(msg) {
  let contestants = collectContestants(msg.member.voiceChannel);
  let positions = createPositions(contestants.length);
  assignRoles(contestants, positions, msg);
  msg.channel.send(`I think @MichorJay might be Merlin`);
}

function assignRoles(contestants, positions, msg) {
  for (let i = contestants.length; i > 0; i--) {
    console.log("Iteration " + i);
    const randomNumber = randomNumberInRange(contestants.length);
    const contestant = contestants.splice(randomNumber, 1);
    const position = positions.pop();
    console.log(contestant, position);
    directMessageRole(contestant, position);
  }
}

function directMessageRole(contestant, position) {
  bot.fetchUser(contestant).then(user => {
    user.send(`In the coming battle of Wits you will represent, ${position}`);
  });
}
function createPositions(population) {
  switch (population) {
    case 1:
      return ["Merlin"];
      break;
    case 2:
      return ["Merlin", "Assassin"];
      break;
    case 5:
      return [
        "Merlin",
        "Loyal Servant of Arthur",
        "Loyal Servant of Arthur",
        "Assassin",
        "Minion of Mordred"
      ];
      break;
    case 6:
      return [
        "Merlin",
        "Loyal Servant of Arthur",
        "Loyal Servant of Arthur",
        "Loyal Servant of Arthur",
        "Assassin",
        "Minion of Mordred"
      ];
      break;
    case 7:
      return [
        "Merlin",
        "Loyal Servant of Arthur",
        "Loyal Servant of Arthur",
        "Loyal Servant of Arthur",
        "Mordred",
        "Assassin",
        "Minion of Mordred"
      ];
      break;
    case 8:
      return [
        "Merlin",
        "Loyal Servant of Arthur",
        "Loyal Servant of Arthur",
        "Loyal Servant of Arthur",
        "Loyal Servant of Arthur",
        "Mordred",
        "Assassin",
        "Minion of Mordred"
      ];
      break;
    case 9:
      return [
        "Merlin",
        "Percival",
        "Loyal Servant of Arthur",
        "Loyal Servant of Arthur",
        "Loyal Servant of Arthur",
        "Loyal Servant of Arthur",
        "Mordred",
        "Assassin",
        "Morgana"
      ];
      break;
    case 10:
      return [
        "Merlin",
        "Percival",
        "Loyal Servant of Arthur",
        "Loyal Servant of Arthur",
        "Loyal Servant of Arthur",
        "Loyal Servant of Arthur",
        "Oberon",
        "Mordred",
        "Assassin",
        "Morgana"
      ];
      break;
    default:
  }
}

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
  let contestants = collectContestants(msg.member.voiceChannel);
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
    .then(function(doc) {
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
    .catch(function(error) {
      console.log("Error getting document" + error);
    });
}

function assignNightRandomly(date, msg) {
  //get all users in voiceChannel
  let contestants = collectContestants(msg.member.voiceChannel);
  //make a winning number and assign to a user
  const goldenTicket = randomNumberInRange(contestants.length);
  const lottoWinner = contestants[goldenTicket];
  // return that user and declare that it is their night
  writeNight(lottoWinner, date, msg);
}

function collectContestants(voiceChannel) {
  let applicants = voiceChannel.members.array();
  let contestants = [];
  for (let i = 0; i < applicants.length; i++) {
    // Add if statement here to exclude bots from the contest
    if (!applicants[i].user.bot) {
      let contestant = applicants[i].user.id;
      contestants.push(contestant);
    }
  }
  return contestants;
}

function randomNumberInRange(range) {
  return Math.floor(Math.random() * Math.floor(range));
}

function writeNight(lottoWinner, date, msg) {
  return db
    .collection("night")
    .doc(date)
    .set({
      nightOwner: lottoWinner
    })
    .then(function(docRef) {
      msg.channel.send(`Let tonight be ${lottoWinner}'s night.`);
      console.log(`Night Owner ${lottoWinner} written to firestore`);
    })
    .catch(function(error) {
      msg.channel.send(`Failed to assign night..`);
      console.log(`Failure to write ${lottoWinner} to firestore`);
    });
}

// Forced Clean UP
//================
async function cleanUpBotMessages(msg) {
  let history = await getHistory(msg);
  let deletedMessagesCount = 0;
  for (let msg of history) {
    if (msg.author.bot) {
      msg.delete();
      deletedMessagesCount++;
    }
    if (msg.content.startsWith(prefix)) {
      msg.delete();
      deletedMessagesCount++;
    }
  }
  msg.channel.send(
    `I have gone through the last 100 messages, and have deleted ${deletedMessagesCount} messages authored by bots.`
  );
}

async function getHistory(msg) {
  let history = await msg.channel.fetchMessages({ limit: 100 });
  let historyArray = history.array();
  return historyArray;
}

bot.login(process.env.DISCORD_BOT_TOKEN);
exports.bot = bot;
