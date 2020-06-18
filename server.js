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
bot.login(process.env.DISCORD_BOT_TOKEN);
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

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
    case `${prefix}pickCaptains`:
      pickCaptains(msg);
      break;
    case `${prefix}cleanUp`:
      cleanUpBotMessages(msg);
      break;
    case `${prefix}about`:
      aboutPrometheus(msg);
      break;
    case `${prefix}avalon`:
      avalonStart(msg);
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
  let contestants = collectContestants(msg.member.voiceChannel);
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

///AVALON CODE
//++++++++++++
//I wanna abstract this to its own file but am having difficulties accessing bot commands in a seperate sheet

const createGame = require("./game.js");
const collectContestants = require("./tools/channelCommands.js");
const randomNumberInRange = require("./tools/tools.js");
const { avalonEmbed } = require("./embeds.js");

function avalonStart(msg) {
  let contestants = collectContestants(msg.member.voiceChannel, msg);
  let playerCount = contestants.length;
  console.log(playerCount)
  let roles = createGame(contestants.length);
  // Catch roles as they are assigned
  // Grab from db discord id or create new profile
  // update map with current role
  // Save to db
  // send roles

  startGame(contestants, roles);
  sendAvalonEmbed(playerCount, roles, msg);
}

function sendAvalonEmbed(playerCount, roles, msg) {
  let embed = avalonEmbed
  switch (playerCount) {
    case 1:
      embed.setImage('https://cdn.glitch.com/54870591-2d55-4c59-ad9f-3316b2eb0ac8%2Fquest.png?v=1589768187704');
      break;
    case 5:
      embed.setImage('https://cdn.glitch.com/54870591-2d55-4c59-ad9f-3316b2eb0ac8%2Favalon5.jpg?v=1592487784371');
      break;
    case 6:
      embed.setImage('https://cdn.glitch.com/54870591-2d55-4c59-ad9f-3316b2eb0ac8%2Favalon6.jpg?v=1592487764875');
      break;
    case 7:
      embed.setImage('https://cdn.glitch.com/54870591-2d55-4c59-ad9f-3316b2eb0ac8%2Favalon7.jpg?v=1592487762808');
      break;
    case 8:
      embed.setImage('https://cdn.glitch.com/54870591-2d55-4c59-ad9f-3316b2eb0ac8%2Favalon8.jpg?v=1592487760344');
      break;
    case 9:
      embed.setImage('https://cdn.glitch.com/54870591-2d55-4c59-ad9f-3316b2eb0ac8%2Favalon10.jpg?v=1592487755846');
      break;
    default:
      msg.channel.send("Inoperable number of players")
  }
  embed.setFooter(roles)
  msg.channel.send(embed);
}
function startGame(contestants, roles) {
  for (let i = contestants.length; i > 0; i--) {
    const randomNumber = randomNumberInRange(contestants.length);
    const discordID = contestants.splice(randomNumber, 1).toString();
    const role = roles.pop();
    readAvalonians(discordID, role);
  }
}

function readAvalonians(discordID, role) {
  db.collection("avalonians")
    .doc(discordID)
    .get()
    .then(doc => {
      if (doc.exists) {
        let avalonian = doc.data();
        updateAvalonianPlaycount(discordID, role, avalonian);
      } else {
        console.log("No such avalonian");
        createAvalonian(discordID, role);
      }
    })
    .catch(error => {
      console.log("Error" + error);
    });
}
function createAvalonian(discordID, role) {
  const avalonian = {
    Merlin: 0
  };
  avalonian[role.name] = 1;
  db.collection("avalonians")
    .doc(discordID)
    .set(avalonian)
    .then(directMessageAvalonRole(discordID, role))
    .catch(err => {
      console.log("Error Creating Avalonian in fire store");
      console.log(err);
    });
}

function updateAvalonianPlaycount(discordID, role, avalonian) {
  if (!avalonian[role.name]) {
    avalonian[role.name] = 1
  } else {
    avalonian[role.name]++;
  }

  db.collection("avalonians")
    .doc(discordID)
    .set(avalonian)
    .then(directMessageAvalonRole(discordID, role))
    .catch(err => {
      console.log("Error Creating Avalonian in fire store");
      console.log(err);
    });
}

function directMessageAvalonRole(discordID, role) {
  bot.fetchUser(discordID).then(user => {
    user.send(
      `In the coming battle of Wits you will represent, ${role.name}, a ${role.description}`
    );
  });
}
