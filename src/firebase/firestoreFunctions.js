const firebase = require("firebase/app");
const firestore = require("firebase/firestore");
const { firebaseConfig } = require("./config.js");
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

function readAvalonian(discordID, role) {
    db.collection("avalonians")
      .doc(discordID)
      .get()
      .then(doc => {
        if (doc.exists) {
          let avalonian = doc.data();
          updateAvalonian(discordID, role, avalonian);
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
      .catch(err => {
        console.log("Error Creating Avalonian in fire store");
        console.log(err);
      });
  }
  
  function updateAvalonian(discordID, role, avalonian) {
    if (!avalonian[role.name]) {
      avalonian[role.name] = 1
    } else {
      avalonian[role.name]++;
    }
  
    db.collection("avalonians")
      .doc(discordID)
      .set(avalonian)
      .catch(err => {
        console.log("Error Creating Avalonian in fire store");
        console.log(err);
      });
  }

module.exports.readAvalonian = readAvalonian;
module.exports.createAvalonian = createAvalonian;
module.exports.updateAvalonian = updateAvalonian;
