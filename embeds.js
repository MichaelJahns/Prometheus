const Discord = require("discord.js");

const aboutEmbed = new Discord.RichEmbed()
  .setAuthor(
    "Promethus",
    "https://cdn.glitch.com/54870591-2d55-4c59-ad9f-3316b2eb0ac8%2FPrometheus_thumb.jpg?v=1562802583861",
    "https://github.com/MichaelJahns/Prometheus"
  )
  .setTitle("About Prometheus")
  .setDescription(
    "Promethus is a personal discord bot that offers discord guilds meta-gaming utility"
  )
  .setColor("#E84515")
  .setURL("https://github.com/MichaelJahns/Prometheus")
  .setThumbnail(
    "https://cdn.glitch.com/54870591-2d55-4c59-ad9f-3316b2eb0ac8%2FPrometheus_thumb.jpg?v=1562802583861"
  )
  .addBlankField()
  .addField("Type 'commands'", "For a list of all available commands")
  .addField(
    "Promethus is listening...",
    "Promehtus will stop listening for additional commands in 15 seconds."
  )
  .setTimestamp()
  .setFooter("authored by Michael Jahns");

const commandsEmbed = new Discord.RichEmbed()
  .setAuthor(
    "Promethus",
    "https://cdn.glitch.com/54870591-2d55-4c59-ad9f-3316b2eb0ac8%2FPrometheus_thumb.jpg?v=1562802583861",
    "https://github.com/MichaelJahns/Prometheus"
  )
  .setTitle("Prometheus")
  .setDescription("All available commands")
  .setColor("#E84515")
  .setURL("https://github.com/MichaelJahns/Prometheus")
  .setThumbnail(
    "https://cdn.glitch.com/54870591-2d55-4c59-ad9f-3316b2eb0ac8%2FPrometheus_thumb.jpg?v=1562802583861"
  )
  .addField(
    "-cleanUp",
    "Removes all messages authored by bots in the last one hundred messages",
    true
  )
  .addField(
    "-assignNight",
    "Picks a random user in the voice call to be the shotcaller for the night",
    true
  )
  .addField(
    "-pickCaptains",
    "Picks two random users in a call to be team captains",
    true
  );

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
	.setImage('https://cdn.glitch.com/54870591-2d55-4c59-ad9f-3316b2eb0ac8%2Fquest.png?v=1589768187704')
  .addBlankField()
  .setFooter("Avalon designed by Don Eskridge");

exports.aboutEmbed = aboutEmbed;
exports.commandsEmbed = commandsEmbed;
exports.avalonEmbed = avalonEmbed;
