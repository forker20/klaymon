
const Discord = require('discord.js');
const functions = require('../../functions/function');
const discord = require("discord.js")
const { MessageEmbed } = require('discord.js')

module.exports = async (options) => {
	functions.checkForUpdates();
	if (!options.message) {
		throw new Error('Klaymon Err: message argument was not specified.');
	}
	if (typeof options.message !== 'object') {
		throw new TypeError('Klaymon Err: Invalid Discord Message was provided.');
	}

    if(!options.opponent) {
        throw new Error("Klaymon Err: opponent argument was not specified.")
    }
    if(typeof options.opponent !== 'object') {
        throw new TypeError('Klaymon Err: Invalid Discord opponent was provided.');
    }

        let challengeEmbed = new MessageEmbed()
        .setTitle(options.challangeTitle)
        .setDescription(options.challangeDes)
        .setColor(options.color);
        let challangeRow = [
			{
				type: 1,
				components: [
					{
						type: 2,
						style: options.buttons.accept_style,
						custom_id: `accept_${options.message.author.id}`,
						label: options.buttons.accept,
					},
					{
						type: 2,
						style: options.buttons.deny_style,
						custom_id: `deny_${options.message.author.id}`,
						label: options.buttons.deny,
					},
				],
			},
		];
         let challMsg = await options.message.reply({embeds: [challengeEmbed], components: challangeRow});
         let challangeFilter = (int => { return int.user.id === options.opponent.id; });
         const challange = options.message.channel.createMessageComponentCollector({
			challangeFilter,
			componentType: 'BUTTON',
		});
            challange.on('collect', async int => {
           await int.deferUpdate();
           if(int.customId === `deny_${options.message.author.id}`) {
           challenge.stop();
           challangeRow[0].components[0].disabled = true;
           challangeRow[0].components[1].disabled = true;
           
           let didntAccept = new MessageEmbed()
           .setTitle(options.noTitle)
           .setDescription(options.noDes)
           .setColor(options.color);
           challMsg.edit({embeds: [didntAccept]});
   } else {
              challMsg.delete();
              challenge.stop();
		const positions = {
			first: '🏁▫️▪️▫️▪️▫️▪️▫️🏁',
			second: `                                🚗 - <@${options.message.author.id}>`,
			third: `                                 🚙 - <@${options.opponent.id}>`,
			fourth: '🏁▫️▪️▫️▪️▫️▪️▫️🏁',
		};

		const blue = String(Math.random()) + `_${options.opponent.id}`;
		const red = String(Math.random()) + `_${options.message.author.id}`;

		positions.second = positions.second.split('');
		positions.third = positions.third.split('');

		const speed = 2;

		const data = { first: 30, second: 30 };

		const componentsArray = [
			{
				type: 1,
				components: [
					{
						type: 2,
						style: 'PRIMARY',
						custom_id: blue,
						emoji: { name: '🚙' },
					},
					{
						type: 2,
						style: 'DANGER',
						custom_id: red,
						emoji: { name: '🚗' },
					},
				],
			},
		];

		const msg = await options.message.reply({
			content: positions.first + '\n' + positions.second.join('') + '\n' + positions.third.join('') + '\n' + positions.fourth,
			components: componentsArray,
		});

		const filter = (button => { return button.user.id === options.message.author.id || button.user.id === options.opponent.id; });
		const game = options.message.channel.createMessageComponentCollector({
			filter,
			componentType: 'BUTTON',
		});

		function update(win, who) {
			if(win === true && who) {
				game.stop();
				componentsArray[0].components[0].disabled = true;
				componentsArray[0].components[1].disabled = true;   
                if(!options.winMessage) {
                    options.winMessage = `Awww, ${who.username} won!`
                }
                if(typeof options.winMessage !== "string") {
                    throw new TypeError(`Klaymon Err: winMessage must be a string.`)
                }
  

				//options.message.channel.send(`${options.winMessage.replace( '<@{{whoWin}}>', `<@${who.id}>`)}`)
				const obj = {
					'<@{{whoWin}}>': `<@${who.id}>`,
					'{{whoWin}}' : `${who.username}`
				}
				options.message.reply(`${options.winMessage.replace( /<@{{whoWin}}>|{{whoWin}}/g, match => obj[match])}`);
			}

			msg.edit({
				content: positions.first + '\n' + positions.second.join('') + '\n' + positions.third.join('') + '\n' + positions.fourth,
				components: componentsArray,
			});
		}
		game.on('collect', async button => {
			button.deferUpdate();
			for(let i = 0; i < speed; i++) {
				if(button.customId === blue && button.user.id === options.opponent.id) {
					data.second--;
					if(i === speed - 1) data.second === 0 ? update(true, options.opponent) : update();
					positions.third.shift();
				}
				else if(button.user.id === options.message.author.id && button.customId === red) {
					data.first--;
					if(i === speed - 1) data.first === 0 ? update(true, options.message.author) : update();
					positions.second.shift();
				}
			}
		});

	
    }
})
};
