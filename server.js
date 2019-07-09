const Discord = require('discord.js');
const firebase = require("firebase/app");
const firestore = require("firebase/firestore");
const bot = new Discord.Client();
const prefix = "-";

bot.on('ready', async () => {
  console.log(`${bot.user.tag} is live.`);
  try{
    let link = await bot.generateInvite(["ADMINISTRATOR"]);
    console.log(link);
  } catch(error){
    console.log(error);
  }
})

const firebaseConfig = {
   apiKey: process.env.FIREBASE_API_KEY,
   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
   databaseURL: process.env.FIREBASE_DB_URL,
   projectId: process.env.FIREBASE_PROJECT_ID,
   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
   messagingSenderId: process.env.FIREBASE_SENDER_ID,
   appId: process.env.FIREBASE_APP_ID
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


// listen for commands

bot.on("message", async msg => {
  if(msg.author.bot) return;
  if(msg.channel.type === "dm") return;
  
  let splitMessage = msg.content.split(" ");
  let command = splitMessage[0];
  
  if(!command.startsWith(prefix)) return;
  
  if(command === `${prefix}assignNight`){
    assignNight(msg)
  }
  if(command === `${prefix}pickCaptains`){
    pickCaptains(msg)
  }
  if(command === `${prefix}cleanUp`){
    cleanUpBotMessages(msg);
  }
  if(command === `${prefix}about`){
  //   aboutPrometheus();
  }
})

// Team Captain Functions
//=======================
function pickCaptains(msg){
  if(msg.member.voiceChannel === undefined){
    msg.channel.send(`You must be in a voice channel to use this command.`)
    return;
  }
  let contestants = collectContestants(msg.member.voiceChannel);
  if(contestants.length >= 2){
  const ticketOne = randomNumberInRange(contestants.length);
  const captainOne = contestants.splice(ticketOne, 1);
  const ticketTwo = randomNumberInRange(contestants.length);
  const captainTwo = contestants.splice(ticketTwo, 1);
  msg.channel.send(`Let ${captainOne} and ${captainTwo} be the team captains this game.`);  
  } else{
    msg.channel.send(`${msg.author} you are alone in that call.`)
  }
}

// Night Assignment Functions
//===========================
function assignNight(msg){
  // Return is sender is not an active participant
  if(msg.member.voiceChannel === undefined){
    msg.channel.send(`You must be in a voice channel to use this command.`)
    return;
  }
  let date = new Date().toDateString();
  isNightOwned(date, msg);
}

function isNightOwned(date, msg){
  return db.collection("night").doc(date).get()
    .then(function(doc){
    if(doc.exists){
      // Night is already owned, the dice will not roll again
      msg.channel.send(`I have already decided that it is ${doc.data().nightOwner}'s night.`)
    } else{
      // Night is not owned, a member will be selected at random from the same voice chat as the orginal messages author
      msg.channel.send(`Tonight has not yet been assigned.`)
      assignNightRandomly(date, msg)
    }
  }).catch(function(error){
    console.log("Error getting document" + error);
  })
}

function assignNightRandomly(date, msg){
    //get all users in voiceChannel
    let contestants = collectContestants(msg.member.voiceChannel)
    //make a winning number and assign to a user
    const goldenTicket = randomNumberInRange(contestants.length)
    const lottoWinner = contestants[goldenTicket]    
    // return that user and declare that it is their night
    writeNight(lottoWinner, date, msg)
}

function collectContestants(voiceChannel){
  let applicants = voiceChannel.members.array();
  let contestants = [];
  for(let i = 0; i < applicants.length; i++){
    // Add if statement here to exclude bots from the contest
      let contestant = applicants[i].user.username;
      contestants.push(contestant);
  }
  return contestants;
}

function randomNumberInRange(range){
  return Math.floor(Math.random() * Math.floor(range));
}

function writeNight(lottoWinner, date, msg){
  return db.collection("night").doc(date).set({
    nightOwner : lottoWinner,
  }).then(function(docRef){  
      msg.channel.send(`Let tonight be ${lottoWinner}'s night.`)
      console.log(`Night Owner ${lottoWinner} written to firestore`)
  }).catch(function(error){
      msg.channel.send(`Failed to assign night..`)
      console.log(`Failure to write ${lottoWinner} to firestore`)
  })
}

// Forced Clean UP
//================
async function cleanUpBotMessages(msg){
  let history = getHistory(msg);
  let deletedMessagesCount = 0;
  for(let msg of history){
    if(msg.author.bot){
      msg.delete();
      deletedMessagesCount++;
    }
  }
  msg.channel.send(`I have gone through the last 100 messages, and have deleted ${deletedMessagesCount} messages authored by bots.`)
}

async function getHistory(msg){
  let history = await msg.channel.fetchMessages({limit : 100});
  let historyArray = history.array();
  return history;
}

bot.login(process.env.DISCORD_BOT_TOKEN)