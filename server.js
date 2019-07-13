const Discord = require('discord.js');
const firebase = require("firebase/app");
const firestore = require("firebase/firestore");
const bot = new Discord.Client();
const prefix = "-";

bot.on('ready', async () => {
  console.log(`${bot.user.tag} is live.`);
  bot.user.setStatus('available')
    bot.user.setPresence({
        game: {
            name: 'paint dry',
            type: "WATCHING",
            url: " "
        }
    });
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
    aboutPrometheus(msg);
  }
  if(command === `${prefix}adventure`){
    adventureStart(msg);
  }
  else{
    msg.channel.send(`${command} is not a known command. For a list of known commands, try <-about>`)
  }
})

function broadcast(msg){
  msg.channel.send('My message to react to.').then(sentMessage => {
	sentMessage.react('👍');
	sentMessage.react('<emoji id>');
});
}

function adventureStart(msg){
  // Collect how many members are in a call
  // Confirm number with orginator of request
  // dm every playing memeber their identity card
  // start game state
  // check for game over
  // randomly assign a king
  // set timeout 5mins
  // after timeout bot demands a vote be done, reaction collecctor
  // bot will have two routes
  // shift king one and allow another xminutes
  // or
  // dm the selected team
  // compile and read results
  // return result to users
  // update gamestate
}

// About Functions
//================
function aboutPrometheus(msg){
  const aboutEmbed = getAboutEmbed();
  msg.channel.send(aboutEmbed).then(() => {
	const filter = m => msg.author.id === m.author.id;
	msg.channel.awaitMessages(filter, { time: 15000, maxMatches: 1, errors: ['time'] })
		.then(messages => {
    const response = messages.first().content;
    if(response === 'commands'){
      const commandsEmbed = getCommandsEmbed();
      msg.channel.send(commandsEmbed);
    }else{
      msg.channel.send(`Unrecognized input.`)
    }
		})
		.catch(() => {
      msg.channel.send(`No follow up command was issued`)
			console.log(`No follow up command was issued`)
		});
});
}
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

function getAboutEmbed(){
  const aboutEmbed = new Discord.RichEmbed()
  .setAuthor('Promethus', 'https://cdn.glitch.com/54870591-2d55-4c59-ad9f-3316b2eb0ac8%2FPrometheus_thumb.jpg?v=1562802583861', 'https://github.com/MichaelJahns/Prometheus')
  .setTitle('About Prometheus')
  .setDescription('Promethus is a personal discord bot that offers discord guilds meta-gaming utility')
  .setColor('#E84515')
  .setURL('https://github.com/MichaelJahns/Prometheus')
	.setThumbnail('https://cdn.glitch.com/54870591-2d55-4c59-ad9f-3316b2eb0ac8%2FPrometheus_thumb.jpg?v=1562802583861')
	.addBlankField()
  .addField('Type \'commands\'','For a list of all available commands')
  .addField('Promethus is listening...', 'Promehtus will stop listening for additional commands in 15 seconds.')
	.setTimestamp()
	.setFooter('authored by Michael Jahns');
  return aboutEmbed
}

function getCommandsEmbed(){
  const commandsEmbed = new Discord.RichEmbed()
  .setAuthor('Promethus', 'https://cdn.glitch.com/54870591-2d55-4c59-ad9f-3316b2eb0ac8%2FPrometheus_thumb.jpg?v=1562802583861', 'https://github.com/MichaelJahns/Prometheus')
  .setTitle('Prometheus')
  .setDescription('All available commands')
  .setColor('#E84515')
  .setURL('https://github.com/MichaelJahns/Prometheus')
	.setThumbnail('https://cdn.glitch.com/54870591-2d55-4c59-ad9f-3316b2eb0ac8%2FPrometheus_thumb.jpg?v=1562802583861')
	.addField('-cleanUp', 'Removes all messages authored by bots in the last one hundred messages', true)
	.addField('-assignNight', 'Picks a random user in the voice call to be the shotcaller for the night', true)
	.addField('-pickCaptains', 'Picks two random users in a call to be team captains', true)

  return commandsEmbed;
}

bot.login(process.env.DISCORD_BOT_TOKEN);


// List of all available commands

// function test(msg){
//   msg.channel.send(`Im listening for the word 'discord'`)
//   const filter = m => m.content.includes('discord');
//   const collector = msg.channel.createMessageCollector(filter, {time : 15000})
//   collector.on('collect', m => {
// 	  console.log(`Collected ${m.content}`);
//   });

//   collector.on('end', collected => {
// 	  console.log(`Collected ${collected.size} items`);
//     for(let msg of collected){
//       console.log(msg);
//     }
//   });
// }
