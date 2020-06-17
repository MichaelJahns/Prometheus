// Code I hoped to turn into a quest command
async function quest(msg, partySize) {
  let contestants = collectContestants(msg.member.voiceChannel, msg);
  if (!contestants) {
    return;
  }

  if (partySize > 5) {
    msg.channel.send(
      "The max quest size is 5, pleases select a smaller number"
    );
  } else if (partySize < 2) {
    msg.channel.send(
      "The minimum quest size is 2, please select a larger number"
    );
  } else {
    let questMsg = `Wise King ${msg.author}, please choose your champions`;

    msg.channel.send(questMsg).then(async function(sentMessage) {
      if (contestants.length >= 5 || contestants.length === 1) {
        await sentMessage.react("1️⃣");
        await sentMessage.react("2️⃣");
        await sentMessage.react("3️⃣");
        await sentMessage.react("4️⃣");
        await sentMessage.react("5️⃣");
      }
      if (contestants.length >= 6) {
        await sentMessage.react("6️⃣");
      }
      if (contestants.length >= 7) {
        await sentMessage.react("7️⃣");
      }
      if (contestants.length >= 8) {
        await sentMessage.react("8️⃣");
      }
      if (contestants.length >= 9) {
        await sentMessage.react("9️⃣");
      }
      if (contestants.length >= 10) {
        await sentMessage.react("🔟");
      }

      await sentMessage
        .awaitReactions(filter, {
          max: partySize,
          time: 10000,
          errors: ["time"]
        })
        .then(collected => console.log(collected))
        .catch(collected => {
          const humans = collected.partition(u => !u.bot);

          const collector = sentMessage.createReactionCollector(filter, {
            time: 10000
          });

          collector.on("collect", (reaction, reactionCollector) => {
            console.log(`Collected ${reaction.emoji.name}`);
          });

          collector.on("end", collected => {
            console.log(`Collected ${collected.size} items`);
          });
        });
    });
  }
}



const filter = (reaction, user) => {
  return (
    reaction.emoji.name === "1️⃣"
    // ||
    // reaction.emoji.name === "2️⃣" ||
    // reaction.emoji.name === "3️⃣" ||
    // reaction.emoji.name === "4️⃣" ||
    // reaction.emoji.name === "5️⃣" ||
    // reaction.emoji.name === "6️⃣" ||
    // reaction.emoji.name === "7️⃣" ||
    // reaction.emoji.name === "8️⃣" ||
    // reaction.emoji.name === "9️⃣" ||
    // reaction.emoji.name === "🔟"
  );
};
