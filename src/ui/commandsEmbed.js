const Discord = require("discord.js");
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
exports.commandsEmbed = commandsEmbed;
