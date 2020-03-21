const TurndownService = require('turndown')
const turndownService = new TurndownService()

async function invite(message) {
    try {
        const embed = {
            author: {
                name: 'HosselBot',
                url: 'https://Hossles.nl/',
                icon_url: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
            },
            description: turndownService.turndown(`<a href="https://discord.gg/7q5VcC6">Join support server</a>`),
            color: 16729344,
            footer: {
                icon_url: 'https://i.imgur.com/Kbw3iEo.png',
                text: 'Reddit Bot by Sam and Kevin',
            }
        }

        await message.channel.send({
            embed
        })

    } catch (error) {
        console.log(error)
    }
}

module.exports = invite