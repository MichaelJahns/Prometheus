///AVALON CODE
//++++++++++++
//I wanna abstract this to its own file but am having difficulties accessing bot commands in a seperate sheet

const createGame = require("./game.js");
const collectVoiceChatParticipantIDs = require("../util/channelCommands.js");
const randomNumberInRange = require("../util/tools.js");

module.exports = function avalon(msg) {
  let contestants = collectVoiceChatParticipantIDs(msg);
   // let playerCount = contestants.length;
  // let roles = createGame(contestants.length);
  // console.log(roles)
  // const embed = buildAvalonEmbed(playerCount, roles, msg);
  // Catch roles as they are assigned
  // Grab from db discord id or create new profile
  // update map with current role
  // Save to db
  // send roles

  startGame(contestants, roles);
}
exports.avalon = this.avalon;

function startGame(contestants, roles) {
  for (let i = contestants.length; i > 0; i--) {
    const randomNumber = randomNumberInRange(contestants.length);
    const discordID = contestants.splice(randomNumber, 1).toString();
    const role = roles.pop();
    readAvalonians(discordID, role);
  }
}

function readAvalonians(discordID, role) {
  db.collection("avalonians")
    .doc(discordID)
    .get()
    .then(doc => {
      if (doc.exists) {
        let avalonian = doc.data();
        updateAvalonianPlaycount(discordID, role, avalonian);
      } else {
        console.log("No such avalonian");
        createAvalonian(discordID, role);
      }
    })
    .catch(error => {
      console.log("Error" + error);
    });
}
function createAvalonian(discordID, role) {
  const avalonian = {
    Merlin: 0
  };
  avalonian[role.name] = 1;
  db.collection("avalonians")
    .doc(discordID)
    .set(avalonian)
    .then(directMessageAvalonRole(discordID, role))
    .catch(err => {
      console.log("Error Creating Avalonian in fire store");
      console.log(err);
    });
}

function updateAvalonianPlaycount(discordID, role, avalonian) {
  if (!avalonian[role.name]) {
    avalonian[role.name] = 1
  } else {
    avalonian[role.name]++;
  }

  db.collection("avalonians")
    .doc(discordID)
    .set(avalonian)
    .then(directMessageAvalonRole(discordID, role))
    .catch(err => {
      console.log("Error Creating Avalonian in fire store");
      console.log(err);
    });
}

function directMessageAvalonRole(discordID, role) {
  bot.fetchUser(discordID).then(user => {
    user.send(
      `In the coming battle of Wits you will represent, ${role.name}, a ${role.description}`
    );
  });
}
