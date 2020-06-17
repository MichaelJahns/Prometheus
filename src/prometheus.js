const { aboutEmbed, commandsEmbed } = require("./firebaseConfig.js");
const { readCurrentNight, writeNight } = require("./firebase.js");
const { collectContestants } = require("../tools/collectContestants.js");
const { randomNumberInRange } = require("../tools/randomNumberInRange.js");


// About Functions
//================
module.exports = function aboutPrometheus(msg) {
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

// Night Assignment Functions
//===========================
module.exports = function assignNight(msg) {
  // Return is sender is not an active participant in the voice chat
  if (msg.member.voiceChannel === undefined) {
    msg.channel.send(`You must be in a voice channel to use this command.`);
    return;
  }
  let date = new Date().toDateString();
  readCurrentNight(date, msg);
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