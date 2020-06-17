const firebase = require("firebase/app");
const firestore = require("firebase/firestore");
const { firebaseConfig } = require("./firebaseConfig.js");
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const { directMessageAvalonRole } = require("../server.js");

// Prometheus Functions
function readCurrentNight(date, msg) {
  return db
    .collection("night")
    .doc(date)
    .get()
    .then(function(doc) {
      if (doc.exists) {
        // Night is already owned, the dice will not roll again
        msg.channel.send(
          `I have already decided that it is ${doc.data().nightOwner}'s night.`
        );
      } else {
        // Night is not owned, a member will be selected at random from the same voice chat as the orginal messages author
        msg.channel.send(`Tonight has not yet been assigned.`);
        assignNightRandomly(date, msg);
      }
    })
    .catch(function(error) {
      console.log("Error getting document" + error);
    });
}
exports.readCurrentNight = readCurrentNight;

function writeNight(lottoWinner, date, msg) {
  return db
    .collection("night")
    .doc(date)
    .set({
      nightOwner: lottoWinner
    })
    .then(function(docRef) {
      msg.channel.send(`Let tonight be ${lottoWinner}'s night.`);
      console.log(`Night Owner ${lottoWinner} written to firestore`);
    })
    .catch(function(error) {
      msg.channel.send(`Failed to assign night..`);
      console.log(`Failure to write ${lottoWinner} to firestore`);
    });
}
exports.writeNight = writeNight;

// Avalon Functions
exports.createAvalonian = createAvalonian;
exports.readAvalonians = readAvalonians;
exports.updateAvalonianPlaycount = updateAvalonianPlaycount;

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

function updateAvalonianPlaycount(discordID, role, avalonian) {
  avalonian[role.name]++;

  db.collection("avalonians")
    .doc(discordID)
    .set(avalonian)
    .then(directMessageAvalonRole(discordID, role))
    .catch(err => {
      console.log("Error Creating Avalonian in fire store");
      console.log(err);
    });
}
