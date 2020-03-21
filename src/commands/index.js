const config = require('../config/config.json')
const client = require('../client')

// requiring commands
const discord = require('./discord')
const ping = require('./ping')
const reddit = require('./reddit')
const helpme = require('./helpme')
const random = require('./random')

const commands = {
    'discord': discord,
    'reddit': reddit,
    'random': random,
    'ping': ping,
    'helpme': helpme,
}

module.exports.check = function(message) {
    let args = message.content.slice(config.Prefix.length).split(" ")
    const pref = message.content.toLowerCase().startsWith(config.Prefix)

    if (pref) {
        if(commands[args[0]] != undefined) {
            return commands[args[0]](message)
        }
            else {
                return message.reply('This command doesn\'t exist! :<')
        }
    }

    if (message.isMentioned(client.user.id)) {
        help(message)
    }

}