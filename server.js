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
  
  if(command === `${prefix}about`){
    aboutPrometheus();
  }
  
  if(command === `${prefix}cleanUp`){
    cleanUp(msg);
  }
})


// Forced Clean UP
async function cleanUp(msg){
  // grab last 100 messages
  let history = await msg.channel.fetchMessages({limit : 100});
  let historyArray = history.array();
  let counter = 0;
  for(let msg of historyArray){
      // check authorship
    if(msg.author.bot){
      // delete all messages written by a bot
      msg.delete();
      counter++;
    }
  }
  // send results
  msg.channel.send(`I have gone through the last 100 messages, and have deleted ${counter} messages authored by bots`)
}

// Night Assignment Functions
async function assignNight(msg){
  // Return is sender is not an active participant
  if(msg.member.voiceChannel === undefined){
    msg.channel.send(`You must be in a voice channel to use this command.`)
    return;
  }
  let date = new Date().toDateString();
  isNightOwned(date, msg);
}
async function isNightOwned(date, msg){
  return db.collection("night").doc(date).get()
    .then(function(doc){
    if(doc.exists){
      // Night is already owned, the dice will not roll again
      msg.channel.send(`I have already decided that it is ${doc.data().nightOwner}'s night`)
    } else{
      // Night is not owned, a member will be selected at random from the same voice chat as the orginal messages author
      msg.channel.send(`Tonight has not yet been assigned`)
      assignNightRandomly(date, msg)
    }
  }).catch(function(error){
    console.log("Error getting document" + error);
  })
}

function assignNightRandomly(date, msg){
    // grab collection of users in call
    let players = msg.member.voiceChannel.members.array();
    let contestants =[]; 

    for(let i = 0; i < players.length; i++){
      let playerName = players[i].user.username;
      contestants.push(playerName);
    }
    // pick one at random
    const goldenTicket = randomContestant(players.length)
    const charlie = contestants[goldenTicket]    
    // return that user and declare that it is their night
    msg.channel.send(`Let tonight be ${charlie}'s night`)
    writeNight(charlie, date)
}

function randomContestant(range){
  return Math.floor(Math.random() * Math.floor(range));
}

function writeNight(charlie, date){
  return db.collection("night").doc(date).set({
    nightOwner : charlie,
  }).then(function(docRef){
console.log(`Night Owner ${charlie} written to firestore`)
  }).catch(function(error){
    console.log(`Failure to write ${charlie} to firestore`)
  })
}

bot.login(process.env.DISCORD_BOT_TOKEN)