module.exports = function getAvalonRoles(playerCount) {
  console.log("Get avalon roles")
  switch (playerCount) {
    case 1:
      return [Developer];
      break;
    case 2:
      return [Developer, Developer];
      break;
    // The minimum number of players is five, the above cases are only here for debugging purposes
    case 5:
      return [
        Merlin,
        Servant,
        Servant,
        Assassin,
        Minion
      ];
      break;
    case 6:
      return [
        Merlin,
        Servant,
        Servant,
        Servant,
        Assassin,
        Minion
      ];
      break;
    case 7:
      return [
        Merlin,
        Servant,
        Servant,
        Servant,
        Oberon,
        Assassin,
        Minion
      ];
      break;
    case 8:
      return [
        Merlin,
        Servant,
        Servant,
        Servant,
        Servant,
        Mordred,
        Assassin,
        Minion
      ];
      break;
    case 9:
      return [
        Merlin,
        Percival,
        Servant,
        Servant,
        Servant,
        Servant,
        Mordred,
        Assassin,
        Morgana
      ];
      break;
    case 10:
      return [
        Merlin,
        Percival,
        Servant,
        Servant,
        Servant,
        Servant,
        Oberon,
        Mordred,
        Assassin,
        Morgana
      ];
      break;
    default:
  }
};

const Merlin = {
  name: "Merlin",
  description: "powerful Wizard in the service of King Arthur, Merlin alone knows the agents of Evil, but they must speak of this only in riddles. If their true identity is discovered, all will be lost for King Arthur."
};
const Assassin = {
  name: "Assassin",
  description: "dangerous assassin in service of Mordred, the assassin can instantly win the game for Evil by 'assassinating' Merlin. The assassin can do this at any time during the game, or after Good has completed three quests. Failing to guess correctly results in a loss for Evil."
};
const Servant = {
  name: "Loyal Servant of Arthur",
  description: "loyal Servant, that knows only Goodness and Honor! King and Country! Their eternal Allegiance is to King Arthur. Loyal Servants of Arthur may never attempt to sabotage a quest."
};
const Minion = {
  name: "Minion of Modred",
  description: "double agent serving Mordred, Minion's special power is the ability to know the other Minions in the Kingdom. Minions of Mordred may choose to sabotage a quest, or to pass them and remain hidden"
}
const Percival = {
  name: "Percival",
  description: "knight of King Arthur, Percival's special power is knowledge of Merlin and Morgana at the start of the game. Using Percival's knowledge wisely is key to protecting Merlin's identity or revealing Morgana's"
}
const Mordred = {
  name: "Mordred",
  description: "traitor to the kingdom, Mordred's special power is that their identity is not revealed to Merlin at the start of the game. Using Mordred's deception wisely can be key to gaining illfounded trust."
}
const Oberon = {
  name: "Oberon",
  description: "King of Fairies who wars with King Arthur of their own accord seperate from the efforts of Mordred, Oberon's special attribute is that they are evil but not a Minion of Mordred and does not reveal themself to evil at the start of the game."
}
const Morgana = {
  name: "Morgana",
  description: "powerful enchantress who serves Morded, Morgana's special power is the ability to confuse Percival at the start of the game. Using Morgana deception wisely can lead Good to question their own."
}

const Developer = {
  name: "Developer",
  description: "Michael Jahns, a real rad guy, check out his work at https://github.com/MichaelJahns"
}