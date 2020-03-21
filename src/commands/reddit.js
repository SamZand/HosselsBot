const axios = require("axios");
const redditPostToEmbed = require("../utils/redditPostToEmbed");

async function find(message) {

    let args = message.content.split(" ");
    console.table(args);

    // subreddit name
    let subreddit = args[1];
    console.log("subreddit: " + subreddit);

    // amount of posts
    let amount;
    // if ( aantal <= 10 && aantal > 0) {
    if (isNaN(args[2])) {
        amount = 1; // set default
        args[3] = args[2];
    } else {
        if (args[2] ? amount = args[2] : amount = 1);
    }
    console.log("amount: " + amount);

    // sort type
    let sort;
    if (args[3] !== undefined ? sort = args[3] : sort = 'hot');
    let sortOptions = ['new', 'top', 'hot', 'rising'];
    if (!sortOptions.includes(sort)) {
        message.reply(`I dont know what ${sort} is, showing hot post(s)`);
        sort = 'top'; // set default
    }
    console.log("sort: " + sort);

    let timespan;
    if (sort == "top") {
        // sort timespan
        if (args[4] !== undefined ? timespan = args[4] : timespan = 'day');
        let timespanOptions = ['hour', 'day', 'week', 'month', 'year', 'all'];
        if (!timespanOptions.includes(timespan)) {
            timespan = 'day'; // set default
        }
        console.log("timespan: " + timespan);
        timespan = "&t=" + timespan;
    }

    console.warn(`https://www.reddit.com/r/${subreddit}/${sort}.json?limit=${amount}${timespan}`);

    if (!subreddit) {
        message.reply("You need to type subreddit name here!");
    } else {
        try {
            if (amount !== undefined && amount > 10) {
                message.reply(`I can't send you more than **10** messages :confused:`);
            } else {
                let res;
                //     if (amount === undefined) {
                //         res = await axios.get(
                //             `https://www.reddit.com/r/${subreddit}/hot.json?limit=1&sort=${sort}`
                //         );
                //     } else {
                res = await axios.get(
                    `https://www.reddit.com/r/${subreddit}/${sort}.json?limit=${amount}${timespan}`
                );
                //     }

                const posts = res.data.data.children;
                if (posts.length == 0) {
                    return message.reply(
                        `There are no hot posts on **${subreddit}** :confused: `
                    );
                }

                for (let index = 0; index < amount; index++) {
                    const post = posts[index];
                    if (post.data.over_18 === true && message.channel.nsfw === false) {
                        return message.reply(
                            `This post is NSFW! Try get it on NSFW channel! :confused:`
                        );
                    } else {
                        const embed = redditPostToEmbed(post);
                        await message.channel.send({
                            embed
                        });
                    }
                }
                // for (const post of posts) {
                //     if (post.data.over_18 === true && message.channel.nsfw === false) {
                //         return message.reply(
                //             `This post is NSFW! Try get it on NSFW channel! :confused:`
                //         );
                //     } else {
                //         const embed = redditPostToEmbed(post);
                //         await message.channel.send({
                //             embed
                //         });
                //     }
                // }
            }
        } catch (Error) {
            console.log(Error);
            message.reply("No subreddits named `" + subreddit + "` :confused:");
        }
    }
}

module.exports = find;