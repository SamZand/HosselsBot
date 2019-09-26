// Import libraries
const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const axios = require('axios');

// Event listener when a user connected to the server.
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("with JavaScript")
});

client.on('message', (message) => {
  if (message.author == client.user) { // Prevent bot from responding to its own messages
    return
  }

  if (message.content.startsWith("!")) {
    processCommand(message)
  }
})

function processCommand(message) {
  let fullCommand = message.content.substr(1) // Remove the leading exclamation mark
  let splitCommand = fullCommand.split(" ") // Split the message up in to pieces for each space
  let primaryCommand = splitCommand[0] // The first word directly after the exclamation is the command
  let arguments = splitCommand.slice(1) // All other words are arguments/parameters/options for the command

  console.log("Command received: " + primaryCommand)
  console.log("Arguments: " + arguments) // There may not be any arguments

  if (primaryCommand === 'ping') {
    pingCommand(arguments, message)
  }
  if (primaryCommand === 'sub') {
    sub(arguments, message)
  }
  if (primaryCommand === 'd') {
    dice(arguments, message);
  }
}

function pingCommand(arguments, message) {
  message.reply("pong ")
}

async function sub(arguments, message) {
  
  client.user.setActivity("with Reddit")
  let args = arguments;

  if (args === "") {
    message.reply("You need to type subreddit name here!");
  } else {
    try {
      if (args[1] !== undefined && args[1] > 10) {
        message.reply(`I can't send you more than **10** messages :confused:`);
      } else {
        let res;
        if (args[1] === undefined) {
          res = await axios.get(
            `https://www.reddit.com/r/${args[0]}/top.json?limit=1&sort=new`
          );
        } else {
          res = await axios.get(
            `https://www.reddit.com/r/${args[0]}/top.json?limit=${
                args[1]
              }&sort=new`
          );
        }

        const posts = res.data.data.children;
        if (posts.length == 0) {
          return message.reply(
            `There are no top posts on **${args[0]}** :confused: `
          );
        }

        for (const post of posts) {
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
      }
    } catch (Error) {
      //console.log(Error);
      message.reply("No subreddits named `" + message + "` :confused:");
    }
  }
}

function dice(arguments, message) {
  let args = arguments;
  let size = args[0];
  let maxSize = 10;
  let amount = args[1];

  if (!amount) {
    message.reply(rollDie(size));
    return;
  } else if (amount <= maxSize) {
    for (let i = 0; i < amount; i++) {
      message.reply(rollDie(size));
    }
    return;
  } else {
    message.reply("vind je meer dan" + maxSize + "dobbelstenen niet wat onnodig?");
    return;
  }
}

// returns a number based on the size of the die
function rollDie(size) {
  return Math.floor(Math.random() * size) + 1;
}

function redditPostToEmbed(post) {
  const text = post.data;
  const extension = [".jpg", ".png", ".svg", ".mp4", ".gif"];
  const date = new Date(text["created_utc"] * 1000);
  let image;
  let pre;
  let media;
  let des;

  if (text.selftext.length > 1000) {
    des = text.selftext.substring(0, 999) + "...";
  } else {
    des = text.selftext
  }

  if (text.preview !== undefined) {
    pre = text.preview.images[0].source.url;
  }

  if (text.media !== null) {
    media = text.thumbnail
  }

  if (extension.includes(text.url.slice(-4))) {
    image = text.url;
  } else if (pre !== null || media !== null) {
    if (media !== null) {
      image = media;
    } else {
      image = pre;
    }
  } else {
    image = null;
  }

  const embed = {
    title: `${text.title}`,
    url: `https://www.reddit.com${text.permalink}`,
    author: {
      name: text.author,
      icon_url: "https://i.kym-cdn.com/photos/images/newsfeed/000/919/691/9e0.png"
    },
    description: des,
    timestamp: date,
    image: {
      url: image
    },
    color: 16729344,
    footer: {
      text: "Reddit Bot by Fosscord Team",
      icon_url: "https://raw.githubusercontent.com/fosscord/assets/master/PNG/1024x/cord-blue.png"
    },
    "fields": [{
        "name": `${client.emojis.find(x => x.name === 'upvote')} Upvoted by`,
        "value": `${text.ups} people`,
        "inline": true
      },
      {
        "name": `${client.emojis.find(x => x.name === 'comment')} Commented by`,
        "value": `${text.num_comments} people`,
        "inline": true
      }
    ]
  };
  return embed;
};

// Initialize bot by connecting to the server
client.login(auth.token);