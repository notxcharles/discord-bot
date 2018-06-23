require('dotenv').config();
require("babel-register");
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
		?harambe
		Sends a picture to the chat with a picture of Harambe.
	*/
	if (msg.content === '?harambe') {
		msg.reply('https://i.imgur.com/0qZGhaD.jpg');
	}

	/*
		?sexyman
		Command requested by Каппа#7296
	*/
	if (msg.content === '?sexyman') {
		client.channels.get(msg.channel.id).send(`https://i.imgur.com/YNqBodQ.png`);
	}

	/*
		?help
		Will send information in the chat to help the user use the bot
	*/

    /*
        ?hwstats
        Will respond to the user with various statistics about the hardware.
    */
    if (msg.content === '?hwstats') {
        if(msg.author.id === process.env.ownerId) {
            osutils.cpuUsage((v) => {
		let usedMem = os.freemem() / 1000000;
		let totalMem = os.totalmem() / 1000000;
		client.channels.get('459510497016938507').send({embed:{
			color: 3447003,
			title: "Hardware Stats",
			fields:[
				{
					name: "System On Chip",
					value: "Raspberry Pi 3 Model B",
				},
				{
					name: "Operating System",
					value: "Raspbian Lite",
				},
				{
					name: "Platform",
					value: os.platform().replace('l', 'L'),
				},
				{
					name: "Uptime",
					value: os.uptime() + " Seconds",
				},
				{
					name: "CPU Model",
					value: os.cpus()[0].model,
				},
				{
					name: "CPU Usage",
					value: v.toFixed(3) + '%',
				},
				{
					name: "RAM Usage",
					value: usedMem.toFixed(2) + 'MB / ' + totalMem.toFixed(2) + 'MB',
				},
			]
		}});
            });
        }
    }

});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.discordToken);
