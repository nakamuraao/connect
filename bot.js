const { Client, Events, GatewayIntentBits, WebhookClient, AttachmentBuilder } = require('discord.js');
const { channel1, channel2, webhook2, webhook1, token } = require('./config.json');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages,, GatewayIntentBits.MessageContent] });
const axios = require('axios')

client.once(Events.ClientReady, c => {
	console.log(`Logged in as ${c.user.tag}`);
});

client.on(Events.MessageCreate, msg => {
    if(msg.webhookId)return;
    if(msg.stickers.size > 0)return;
    if(msg.author.bot)return;
    if(msg.channelId === channel1){
        const channel = client.channels.cache.get(channel2);
        const webhook = new WebhookClient({ url: webhook2 })
        if(msg.attachments.size > 0){
            if(msg.content){
                webhook.send({
                    content: msg.content,
                    username: msg.author.username + '#' + msg.author.discriminator,
                    avatarURL: msg.author.avatarURL()
                })
            };
            msg.attachments.forEach(async a => {
                const url = a.url;
                const response = await axios.get(url, { responseType: "arraybuffer" });
                const buff = Buffer.from(response.data, "base64");
                const file = new AttachmentBuilder(buff, { name: a.name });
                channel.send({ files: [file] });
              });
        }else{
            webhook.send({
                content: msg.content,
                username: msg.author.username+ '#' + msg.author.discriminator,
                avatarURL: msg.author.avatarURL()
            })
        };
    }else if(msg.channelId === channel2){
        const channel = client.channels.cache.get(channel1);
        const webhook = new WebhookClient({ url: webhook1 });
        if(msg.attachments.size > 0){
            if(msg.content){
                webhook.send({
                    content: msg.content,
                    username: msg.author.username + '#' + msg.author.discriminator,
                    avatarURL: msg.author.avatarURL()
                })
            };
            msg.attachments.forEach(async a => {
                const url = a.url;
                const response = await axios.get(url, { responseType: "arraybuffer" });
                const buff = Buffer.from(response.data, "base64");
                const file = new AttachmentBuilder(buff, { name: a.name });
                channel.send({ files: [file] });
              });
        }else{
            webhook.send({
                content: msg.content,
                username: msg.author.username + '#' + msg.author.discriminator,
                avatarURL: msg.author.avatarURL()
            })
        };  
    }else return;
    //console.log(msg);
})

client.login(token);