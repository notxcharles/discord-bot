require("babel-register");
require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const mongoose = require('mongoose');
const os = require('os');
const osutils = require('os-utils');

client.on('message', msg => {

    /*
        ?ping command
        Will respond to the user with the message "Pong!" - this is useful to confirm whether the bot is working properly or not :)
    */
    if (msg.content === '?ping') {
        msg.reply('Pong!');
    }

    /*
        ?hwstats
        Will respond to the user with various statistics about the hardware.
    */
    if (msg.content === '?hwstats') {
        if(msg.author.id === process.env.ownerId) {
            osutils.cpuUsage((v) => {
                msg.reply('Platform: ' + os.platform() + 'CPU Usage (%): ' + v);
            });
        }
    }

});  

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.discordToken);
