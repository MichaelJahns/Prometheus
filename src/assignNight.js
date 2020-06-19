const {db} = require('./firebase/firestoreFunctions')
const {collectVoiceChatParticipantIDs} = require('./util/channelCommands')
const {randomNumberInRange } = require('./util/tools')

function assignNight(msg) {
  // Return if sender is not an active participant in the voice chat
  if (msg.member.voiceChannel === undefined) {
    msg.channel.send(`You must be in a voice channel to use this command.`);
    return;
  }
  let date = new Date().toDateString();
  isNightOwned(date, msg);
}

function isNightOwned(date, msg) {
  return db
    .collection("night")
    .doc(date)
    .get()
    .then(function (doc) {
      if (doc.exists) {
        // Night is already owned, the dice will not roll again
        msg.channel.send(
          `I have already decided that it is ${doc.data().nightOwner}'s night.`
        );
      }
      else {
        // Night is not owned, a member will be selected at random from the same voice chat as the orginal messages author
        msg.channel.send(`Tonight has not yet been assigned.`);
        assignNightRandomly(date, msg);
      }
    })
    .catch(function (error) {
      console.log("Error getting document" + error);
    });
}

function assignNightRandomly(date, msg) {
  //get all users in voiceChannel
  let contestants = collectVoiceChatParticipantIDs(msg);
  //make a winning number and assign to a user
  const goldenTicket = randomNumberInRange(contestants.length);
  const lottoWinner = contestants[goldenTicket];
  // return that user and declare that it is their night
  writeNight(lottoWinner, date, msg);
}
function writeNight(lottoWinner, date, msg) {
  return db
    .collection("night")
    .doc(date)
    .set({
      nightOwner: lottoWinner
    })
    .then(function (docRef) {
      msg.channel.send(`Let tonight be ${lottoWinner}'s night.`);
      console.log(`Night Owner ${lottoWinner} written to firestore`);
    })
    .catch(function (error) {
      msg.channel.send(`Failed to assign night..`);
      console.log(`Failure to write ${lottoWinner} to firestore`);
    });
}

exports.assignNight = assignNight;
