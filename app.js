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
    //If the message doesn't contain the prefix, ignore.
    if (msg.content.charAt(0) !== process.env.prefix) return; 
    

    /*
        Lets split the message into the command and it's arguments - 
        .command ay be
        command = command ; arguments = [ay, be]
    */
    const arguments = msg.content.slice(process.env.prefix.length).trim().split(/ +/g);
	const command = arguments.shift().toLowerCase();

    /*
        ?ping command
        Will respond to the user with the message "Pong!" - this is useful to confirm whether the bot is working properly or not :)
    */
    console.log(command)
    if (command === 'ping') {
        msg.reply('Pong!');
        logMessage(msg, {
            command: `${command.charAt(0).toUpperCase()}${command.slice(1)}`,
            info: null
        })
	}

	/*
		?mute command
		This command will mute a user by adding a special role.
	*/
	if (command === 'mute') {
		if (msg.member.roles.has(msg.guild.roles.find("name", "Staff").id)){
            msg.mentions.members.first().addRole(msg.guild.roles.find("name", "muted"));
            logMessage(msg, {
                command: `${command.charAt(0).toUpperCase()}${command.slice(1)}`,
                //Makes the first letter uppercase - ping = Ping
                info: arguments[1] ? arguments.splice(1).toString().replace(/,/g,` `) : null
                //If there is an argument (in this case a reason for the mute) use this as the extra info
                //If there isn't one, null.
            })
		} else {
			msg.member.addRole(msg.guild.roles.find("name", "muted"));
            msg.reply("You are not Staff so you can be muted for that instead!");
            logMessage(msg, {
                command: `${command.charAt(0).toUpperCase()}${command.slice(1)}`,
                //Makes the first letter uppercase - ping = Ping
                info: `Automatic mute of a non-staff member by the system for abuse of ?mute command.`
            })
		}
	}

	/*
		?unmute command
		This command will unmute a user by removing a special role.
	*/
        if (command === 'unmute') {
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
	if (command === 'say') {
		if(msg.author.id === process.env.ownerId) {
            //Arguments is an array - convert to string
            //["Hello", "How", "Are", "You"] = "Hello,How,Are,You"
            //Replace "," with " "
            //"Hello,How,Are,You" = Hello How Are You
            msg.channel.send(arguments.toString().replace(/,/g,` `))
				.then(
					response => {
						msg.delete(100)
							.then(msg => console.log(`Deleted message from ${msg.author.username}`))
							.catch(console.error)
					}
                )
            logMessage(msg, {
                command: `${command.charAt(0).toUpperCase()}${command.slice(1)}`,
                info: arguments.toString().replace(/,/g,` `)
            })
		}
	}

	/*
		?harambe
		Sends a picture to the chat with a picture of Harambe.
	*/
	if (command === 'harambe') {
        msg.reply('https://i.imgur.com/0qZGhaD.jpg');
        logMessage(msg, {
            command: `${command.charAt(0).toUpperCase()}${command.slice(1)}`,
            info: null
        })
	}

	/*
		?sexyman
		Command requested by Каппа#7296
	*/
	if (command === 'sexyman') {
        client.channels.get(msg.channel.id).send(`https://i.imgur.com/YNqBodQ.png`);
        logMessage(msg, {
            command: `${command.charAt(0).toUpperCase()}${command.slice(1)}`,
            info: null
        })
	}

	/*
		?help
		Will send information in the chat to help the user use the bot
	*/

    /*
        ?hwstats
        Will respond to the user with various statistics about the hardware.
    */
    if (command === 'hwstats') {
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
                logMessage(msg, {
                    command: `${command.charAt(0).toUpperCase()}${command.slice(1)}`,
                    info: null
                })
            });
        }
    }

});

const logMessage = function(message, obj){1
    if (!process.env.logMessages) return; //This way we can easily stop the bot from logging actions
    const logChannel = client.channels.get(process.env.logChannel)
    if (!logChannel) return; //If log channel is non-existant, lets stop
    let embed = new Discord.RichEmbed()
        .setAuthor(`Moderation Log`)
        .setColor(3447003)
        .addField(`User`, `${message.author.tag} (ID=${message.author.id}`) //User that initiated the command
        if (message.mentions.members.first()){
            //If a user has been mentioned, show it
            embed.addField(`Mentioned User`, message.mentions.members.first())
        } else {
            if (obj.command.toLowerCase() !== 'say'){ //We don't want to show an argument for ?say
                if (message.content.split(" ")[1]) embed.addField(`Argument`, message.content.split(" ")[1])
            }
            //This allows support for future commands where a user may not be tagged
            //Such as "?purge 20" - 20 will show under the Argument field.
            //If no argument, such as ?hwstats, dont show.
        }
        embed.addField(`Action`, obj.command)
        //If no extra info, don't show the empty field.
        if (obj.info) embed.addField(`Note`, obj.info)
    logChannel.send(embed)
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.discordToken);
