const Eris = require('eris');
 
const bot = new Eris(process.env.DISCORD_BOT_TOKEN);

bot.on('ready', () => {                    
    console.log('Prometheus is live.');                          
});

// Prometheus Returns Greetings
bot.on('messageCreate', (msg) => {                     
    if(msg.content.includes('Hello')) {               
        bot.createMessage(msg.channel.id, `Good Evening ${msg.author.username}`);
        bot.channel.recipients
    }
});

bot.on('messageCreate', (msg) => {
  if(msg.content === "-test"){
    bot.createMessage(msg.channel.id, `channelID ${msg} `)
  }
})

// Embeds Github and Clitch
bot.on("messageCreate", (msg) => { // When a message is created
    if(msg.content === "-about") {
        bot.createMessage(msg.channel.id, {
            embed: {
                title: "Prometheus", // Title of the embed
                description: "A games utility bot, for Friends!",
                author: { // Author property
                    name: bot.username,
                    icon_url: bot.avatarUrl
                },
                color: 15220764, // Color, either in hex (show), or a base-10 integer
                fields: [ // Array of field objects
                    {
                        name: "Hosted on Glitch",
                        value: "https://glitch.com/~prometheus",
                        inline: false
                    },
                    {
                        name: "Github",
                        value: "https://github.com/MichaelJahns",
                        inline: true
                    }
                ],
                footer: { // Footer text
                    text: " "
                }
            }
        });
    }
});

// Embeds Known Commands
bot.on("messageCreate", (msg) => {
  if(msg.content === "-commands"){
        bot.createMessage(msg.channel.id, {
      embed: {
        title: "Commands",
        description: " Subtext ",
        author: {
          name: bot.username,
          icon_url: bot.avatarUrl
        },
        color: 15220764, 
        fields: [
          {
            name: "-about",
            value: "About Prometheus and Creator",
            inline: true
          },
          {
            name: "-commands",
            value: "Dump of all available commands",
            inline: false
          }
        ],
        footer: {
          text:" "
        }
      }
    }
  )}
})

// Counts to ten quick
bot.on("messageCreate", (msg) => {
  if(msg.content === "-spam"){
    for(let i = 0 ; i < 10 ; i++){
        bot.createMessage(msg.channel.id, i+1)
    }
  }
})

// responds with a reaction
bot.on("messageCreate", (msg) => {
  if(msg.content === "-support"){
    console.log(msg)
    msg.addReaction("❤")
  }
})

// this sort of function really doesnt make sense on a messageCreate function
bot.on("messageCreate", (msg) => {
  if(msg.content === "-poll"){
    driver(msg)
  }
})

async function driver(msg){
  var response = await tester(msg);
  console.log(response)
}

async function tester(msg){
  var t = msg.getReaction("❤");
  return t;
}

// Copy reactions
bot.on("messageReactionAdd", (msg, emoji, userID) => {
  
  bot.createMessage(msg.channel.id, "farts")
  msg.addReaction(emoji.name, "@me")
//   msg.addReaction("❤")

//   msg.addReaction(emoji.name)
})

// This below code snippet is outdated, updated last two years, ago. Redo all of it for the modern interactions? Open source?

// bot.registerCommand("ping", "Pong!", { // Make a ping command
// // Responds with "Pong!" when someone says "!ping"
//     description: "Pong!",
//     fullDescription: "This command could be used to check if the bot is up. Or entertainment when you're bored.",
//     reactionButtons: [ // Add reaction buttons to the command
//         {
//             emoji: "⬅",
//             type: "edit",
//             response: (msg) => { // Reverse the message content
//                 return msg.content.split().reverse().join();
//             } 
//         },
//         {
//             emoji: "🔁",
//             type: "edit", // Pick a new pong variation
//             response: ["Pang!", "Peng!", "Ping!", "Pong!", "Pung!"]
//         },
//         {
//             emoji: "⏹",
//             type: "cancel" // Stop listening for reactions
//         }
//     ],
//     reactionButtonTimeout: 30000 // After 30 seconds, the buttons won't work anymore
// });

 
bot.connect();                                         