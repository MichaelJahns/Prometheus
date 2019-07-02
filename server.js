const Discord = require('discord.js');
const bot = new Discord.Client();

bot.on('ready', () => {
  console.log(`${bot.user.tag} is live.`);
})

bot.on('message', msg => {
  if(msg.content === "Hello"){
    msg.reply('World');
  }
})

// listen for command
bot.on("message", msg => {
  if(msg.content === "-assignNight"){
    
    // grab collection of users in call
    let contestants =[];
    const players = msg.member.voiceChannel.members.array();    
    for(let i = 0; i < players.length; i++){
      let playerName = players[i].user.username;
      contestants.push(playerName);
    }
    // pick one at random
    const goldenTicket = randomUser(players.length)
    console.log(contestants[goldenTicket])
    
    // return that user and declare that it is their night
    msg.channel.send(`It is ${contestants[goldenTicket]}'s night`)
    
    //I really wanna hook up some form of DB so that whose night it is cannot be reassigned
  }
})

bot.login(process.env.DISCORD_BOT_TOKEN)

// Helper Functions
function randomUser(range){
  return Math.floor(Math.random() * Math.floor(range));
}