require('dotenv').config();
require("babel-register");
const Discord = require('discord.js');
const client = new Discord.Client();
const mongoose = require('mongoose');
const os = require('os');
const osutils = require('os-utils');

client.on('message', msg => {

	/*
		Ignore messages from bots
		It's possible for bots to go back and forth with each other. It's best to not engage with other bots.
	*/
	if(msg.author.bot) return;

    /*
        ?ping command
        Will respond to the user with the message "Pong!" - this is useful to confirm whether the bot is working properly or not :)
    */
    if (msg.content === '?ping') {
        msg.reply('Pong!');
	}

	/*
		?mute command
		This command will mute a user by adding a special role.
	*/
	if (msg.content.substring(0, 5) === '?mute') {
		if (msg.member.roles.has(msg.guild.roles.find("name", "Staff").id)){
			msg.mentions.members.first().addRole(msg.guild.roles.find("name", "muted"));
			client.channels.get('460295283977224192').send({embed:{
				color: 3447003,
				title: "Moderation Log",
				fields: [
					{
						name: "User",
						value: msg.mentions.members.first().user.tag,
					},
					{
						name: "Action",
						value: "Mute",
					},
					{
						name: "Staff",
						value: msg.author.tag,
					},
				]
				}});
		} else {
			msg.member.addRole(msg.guild.roles.find("name", "muted"));
			msg.reply("You are not Staff so you can be muted for that instead!");
                        client.channels.get('460295283977224192').send({embed:{
                                color: 3447003,
                                title: "Moderation Log",
                                fields: [
                                        {
                                                name: "User",
                                                value: msg.member.user.tag,
                                        },
                                        {
                                                name: "Action",
                                                value: "Mute",
                                        },
                                        {
                                                name: "Staff",
                                                value: "N/A",
                                        },
					{
						name: "Note",
						value: "Automatic mute of a non-staff member by the system for abuse of ?mute command.",
					},
                                ]
                                }});
		}
	}

	/*
		?unmute command
		This command will unmute a user by removing a special role.
	*/
        if (msg.content.substring(0, 7) === '?unmute') {
                if (msg.member.roles.has(msg.guild.roles.find("name", "Staff").id)){
			
                } else {
			msg.member.addRole(msg.guild.roles.find("name", "muted").user.username);
                        msg.reply("You are not Staff so you can be muted for that instead!");

                }
        }

	/*
		?say command
		Make the bot say a string of text provided by the bot owner.
	*/
	if (msg.content.substring(0, 4) === '?say') {
		if(msg.author.id === process.env.ownerId) {
			msg.channel.send(msg.content.substring(5))
				.then(
					response => {
						msg.delete(100)
							.then(msg => console.log(`Deleted message from ${msg.author.username}`))
							.catch(console.error)
					}
				)
		}
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
        if(msg.author.id !== undefined) {
            osutils.cpuUsage((v) => {
		let usedMem = os.freemem() / 1000000;
		let totalMem = os.totalmem() / 1000000;
		msg.channel.send({embed:{
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
