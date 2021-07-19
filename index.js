require("dotenv").config();

const { Client, MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");
const client = new Client();
const PREFIX = "%";

const ACTIVITIES = {
    "poker": {
        id: "755827207812677713",
        name: "Poker Night"
    },
    "betrayal": {
        id: "773336526917861400",
        name: "Betrayal.io"
    },
    "youtube": {
        id: "755600276941176913",
        name: "YouTube Together"
    "chess": {
        id: "832012586023256104",
        name: "Chess"
    },
    "fishington": {
        id: "814288819477020702",
        name: "Fishington.io"
    }
};

client.on("ready", () => console.log("Bot is online!"));
client.on("warn", console.warn);
client.on("error", console.error);

client.on("message", async message => {
    if (message.author.bot || !message.guild) return;
    if (message.content.indexOf(PREFIX) !== 0) return;

    
    const args = message.content.slice(PREFIX.length).trim().split(" ");
    const cmd = args.shift().toLowerCase();

    if (cmd === "ping") return message.channel.send(`Pong! \`${client.ws.ping}ms\``);

    
    if (cmd === "activity") {
        const channel = message.guild.channels.cache.get(args[0]);
        if (!channel || channel.type !== "voice") return message.channel.send("Invalid channel specified! Please use the id of the voice channel and try again.");
        if (!channel.permissionsFor(message.guild.me).has("CREATE_INSTANT_INVITE")) return message.channel.send("Oops, I need the create instant invite permission!");
        const activity = ACTIVITIES[args[1] ? args[1].toLowerCase() : null];
        const embed1 = new MessageEmbed()
      .setTitle('Missing Activity!')
      .setColor(0xff0000)
      .setDescription(`
         **%activity <voice_channel_id> youtube
         %activity <voice_channel_id> poker       
         %activity <voice_channel_id> fishington      
         %activity <voice_channel_id> betrayal      
         %activity <voice_channel_id> chess**      
         `);
        if (!activity) return message.channel.send(embed1);

        fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: activity.id,
                target_type: 2,
                temporary: false,
                validate: null
            }),
            headers: {
                "Authorization": `Bot ${client.token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(invite => {
                if (invite.error || !invite.code) return message.channel.send(`Could not start **${activity.name}**!`);
                message.channel.send(`Click here to start **${activity.name}** in **${channel.name}**: <https://discord.gg/${invite.code}>`);
            })
            .catch(e => {
                message.channel.send(`❌ | Could not start **${activity.name}**!`);
            })
    }
});

client.login(process.env.DISCORD_TOKEN);
