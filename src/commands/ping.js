async function pingCommand(message) {

  try {
      message.reply("pong ")
  } catch (err) {
      console.group(err)
      message.reply("Is stuk `" + "` :confused:");
  }
}

module.exports = pingCommand;