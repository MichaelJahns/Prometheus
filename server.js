const Discord = require('discord.js');
const firebase = require("firebase/app");
const firestore = require("firebase/firestore");
const bot = new Discord.Client();

bot.on('ready', () => {
  console.log(`${bot.user.tag} is live.`);
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



// listen for command
bot.on("message", msg => {
  if(msg.content === "-assignNight"){
    if(msg.member.voiceChannel === undefined){
      msg.channel.send(`You must be in a voice channel to use this command.`)
      return;
    }
    assignNight(msg)
    }
})

async function assignNight(msg){
  let timestamp = new Date();
  let date = timestamp.toDateString()
  // check if the night is owned
  let isNightOwned = await nightOwned(date, msg);
}


// Helper Functions
async function nightOwned(date, msg){
  return db.collection("night").doc(date).get()
    .then(function(doc){
    if(doc.exists){
      msg.channel.send(`I have already decided that it is ${doc.data().nightOwner}'s night`)
    } else{
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
    const goldenTicket = randomUser(players.length)
    const charlie = contestants[goldenTicket]    
    // return that user and declare that it is their night
    msg.channel.send(`Let tonight be ${charlie}'s night`)
    writeNight(charlie, date)
}

function randomUser(range){
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