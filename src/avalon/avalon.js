const getAvalonRoles = require("./gameState");
const { collectVoiceChatParticipantIDs, sendChannelEmbed } = require("../util/channelCommands")
const { randomNumberInRange }= require("../util/tools");
const { readAvalonian } = require("../firebase/firestoreFunctions")
const { buildAvalonEmbed } = require("../ui/avalonEmbed")
const { bot } = require("../server")

function avalon(msg) {
  let contestants = collectVoiceChatParticipantIDs(msg);
  let playerCount = contestants.length;
  let roles = getAvalonRoles(playerCount)
  const avalonEmbed = buildAvalonEmbed(playerCount, roles, msg);
  assignRolesToContestants(contestants, roles);
  sendChannelEmbed(msg, avalonEmbed);
}

function assignRolesToContestants(contestants, roles) {
  for (let i = contestants.length; i > 0; i--) {
    const randomNumber = randomNumberInRange(contestants.length);
    const discordID = contestants.splice(randomNumber, 1).toString();
    const role = roles.pop();
    readAvalonian(discordID, role);
    directMessageAvalonRole(discordID, role);
  }
}

function directMessageAvalonRole(discordID, role) {
  bot.fetchUser(discordID).then(user => {
    console.log(user)
    user.send(
      `In the coming battle of Wits you will represent, ${role.name}, a ${role.description}`
    );
  });
}

module.exports.avalon = avalon;
module.exports.directMessageAvalonRole = directMessageAvalonRole;
