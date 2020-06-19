module.exports = function collectVoiceChatParticipantIDs(msg) {
  console.log("SUCCESS AT LAST")
  const voiceChannel = msg.member.voiceChannel;
  try {
    let applicants = voiceChannel.members.array();
    let participantIDs = [];
    for (let i = 0; i < applicants.length; i++) {
      //if statement to exclude bots from
      if (!applicants[i].user.bot) {
        let applicant = applicants[i].user.id;
        participantIDs.push(applicant);
      }
    }
    return participantIDs;
  } catch (error) {
    msg.channel.send(
      "An error has occured trying to collect participants, to use this command there must be particpants in the Voice Chat. If you dont want to use discord for voice, mute and deafen yourself"
    );
  }
}

exports.collectVoiceChatParticipantIDs = this.collectVoiceChatParticipantIDs;
 
module.exports = function randomNumberInRange(range) {
  return Math.floor(Math.random() * Math.floor(range));
}
exports.randomNumberInRange = this.randomNumberInRange;

async function cleanChat(msg, prefix){
  cleanUpBotMessages(msg);
  cleanUpMessagesToBots(msg, prefix);
}
exports.cleanChat = cleanUpBotMessages;

async function cleanUpBotMessages(msg) {
  let history = await getHistory(msg);
  let deletedMessagesCount = 0;
  for (let msg of history) {
    if (msg.author.bot) {
      msg.delete();
      deletedMessagesCount++;
    }
  }
  msg.channel.send(`In the last 100 messages there are ${deletedMessagesCount} messages authored by bots. I am beggining to remove them.`);
}

async function cleanUpMessagesToBots(msg, prefix){
  let history = await getHistory(msg);
  let deletedMessagesCount = 0;
  for(let msg of history){
    if (msg.content.startsWith(prefix)) {
      msg.delete();
      deletedMessagesCount++;
    }
  }
  msg.channel.send(`In the last 100 messages there are ${deletedMessagesCount} messages authored by bots. I am beggining to remove them.`);
}

async function getHistory(msg) {
  let history = await msg.channel.fetchMessages({ limit: 100 });
  let historyArray = history.array();
  return historyArray;
}


