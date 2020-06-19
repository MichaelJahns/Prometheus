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
exports.aboutEmbed = aboutEmbed;
