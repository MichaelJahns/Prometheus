const Discord = require("discord.js");
const { roleArrayToString } = require("../util/tools.js");

const avalonEmbed = new Discord.RichEmbed()
  .setTitle("Avalon: the Resistance,")
  .setDescription(
    "is a game of hidden loyalty. Players are either Loyal Servants of Arthur fighting for Goodness and Honor or aligned with the Evil ways of Modred. Every player in Voice Chat has been sent their role for the upcoming battle of wits. "
  )
  .setColor("#FFC05A")
  .setURL("https://www.ultraboardgames.com/avalon/game-rules.php")
  .setThumbnail(
    "https://cdn.glitch.com/54870591-2d55-4c59-ad9f-3316b2eb0ac8%2Fholy-grail.png?v=1587850370330"
  )
  .addField(
    "Objective",
    "Good wins the game by successfully completeing three quests, Evils wins if three Quests end in failure. Evil can also win by assassinating Merlin at game's end or at any point during the game.",
    true
  )
  .addField(
    "Discussion",
    "Players may make any claims during the game at any point in the game. Discussion, deception, accusation, and logical deduction are all equally important in order for Good to prevail or Evil to rule the day.",
    true
  )
  .addBlankField()
  .setFooter("Avalon designed by Don Eskridge");

function buildAvalonEmbed(playerCount, roles, msg) {
  console.log(roles);
  let embed = avalonEmbed;
  switch (playerCount) {
    case 1:
      embed.setImage('https://cdn.glitch.com/54870591-2d55-4c59-ad9f-3316b2eb0ac8%2Fquest.png?v=1589768187704');
      break;
    case 5:
      embed.setImage('https://cdn.glitch.com/54870591-2d55-4c59-ad9f-3316b2eb0ac8%2Favalon5.jpg?v=1592487784371');
      break;
    case 6:
      embed.setImage('https://cdn.glitch.com/54870591-2d55-4c59-ad9f-3316b2eb0ac8%2Favalon6.jpg?v=1592487764875');
      break;
    case 7:
      embed.setImage('https://cdn.glitch.com/54870591-2d55-4c59-ad9f-3316b2eb0ac8%2Favalon7.jpg?v=1592487762808');
      break;
    case 8:
      embed.setImage('https://cdn.glitch.com/54870591-2d55-4c59-ad9f-3316b2eb0ac8%2Favalon8.jpg?v=1592487760344');
      break;
    case 9:
      embed.setImage('https://cdn.glitch.com/54870591-2d55-4c59-ad9f-3316b2eb0ac8%2Favalon10.jpg?v=1592487755846');
      break;
    default:
      msg.channel.send("Inoperable number of players");
  }
  embed.addField('Characters', `In a ${playerCount} player game, the roles are ${roleArrayToString(roles)}`);
  return embed;
}

exports.buildAvalonEmbed = buildAvalonEmbed;