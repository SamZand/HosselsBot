async function helpme(message) {
        const embed = {
                title: `Check my crazy commands below!`,
                author: {
                    name: 'HosselsBot',
                    url: 'https://github.com/SamZand/HosselsBot',
                    icon_url: "https://i.imgur.com/Kbw3iEo.png"
                },
                description: `**Prefix: !**\n
**Commands:**
- help
- github (If you want to check the source code, you can take a look :eyes:)
- invite (If you want to invite me on your server just use this command)
- discord (Hossels server)
- reddit
----------------------------------------
**Reddit commands:**
- !reddit <subreddit> <aantal> <new,hot,top,rising> <all,year,month,week,day>`,
        timestamp: new Date(),
        color: 16729344,
        footer: {
            text: "HosselsBot by Kevin and Sam",
            icon_url: "https://i.imgur.com/Kbw3iEo.png"
        },
    }
    await message.channel.send({
        embed
    })
}

module.exports = helpme