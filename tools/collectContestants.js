module.exports = function collectContestants(voiceChannel, msg) {
  try {
    let applicants = voiceChannel.members.array();
    let contestants = [];
    for (let i = 0; i < applicants.length; i++) {
      //if statement to exclude bots from
      if (!applicants[i].user.bot) {
        let contestant = applicants[i].user.id;
        contestants.push(contestant);
      }
    }
    return contestants;
  } catch (error) {
    console.log(error);
    msg.channel.send(
      "To play avalon join the voice chat, if you dont want to use discord for voice, mute and deafen yourself, this bot pulls its player list from the active voice users"
    );
  }
}