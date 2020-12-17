'use strict';

// Import the discord.js module
const Discord = require('discord.js');

const client = new Discord.Client();

let settings = {
  commandPrefix: '!',
  channel: 'math-and-math',
  minNumber: 1,
  maxNumber: 10,
  //@todo mathType: 'addition',
  roundInterval: 8000,
  unansweredRoundsLimit: 5 // Amount of unanswered rounds before the bot will stop
}

let gameLoop = null;
let answer = '';
let unansweredRounds = 0;
let isAnswered = false;
let started = false;

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  if (message.channel.name !== settings.channel) return;
  
  let baseCommand = message.content.split(settings.commandPrefix)[1];

  if (answer == message.content) {
    message.channel.send('Good job **' + message.author.username + '**! You are correct!');
    unansweredRounds = 0;
    isAnswered = true;
  }

  switch(baseCommand) {
      case 'start':
          if (started) break;

          message.channel.send('Game will start in ' + (settings.roundInterval / 1000) + ' seconds!');
          console.log('Starting game');

          gameLoop = setInterval(() => {
            isAnswered = false;
            let firstNumber = between(settings.minNumber, settings.maxNumber);
            let secondNumber = between(settings.minNumber, settings.maxNumber);

            message.channel.send('What is ' + firstNumber + ' + ' + secondNumber + '?');
            answer = firstNumber + secondNumber;

            if (!isAnswered) {
              unansweredRounds++;
            }

            if (unansweredRounds == settings.unansweredRoundsLimit) {
              message.channel.send('There has not been a correct answer for ' + settings.unansweredRoundsLimit + ' rounds. The bot will now stop. To start again type `' + settings.commandPrefix + 'start`.');
              stopBot();
              console.log('Bot has reached unansweredRoundsLimit')
            }
          }, settings.roundInterval);

          started = true;

          break;
      case 'stop':
          if(!started) break;
          stopBot();
          message.channel.send('Game has ended!');
          console.log('Stopping game');
          break;
  }

});

function stopBot() {
  clearInterval(gameLoop);
  started = false;
}

function between(min, max) {  
  return Math.floor(
    Math.random() * (max - min) + min
  )
}

client.login('Nzg4MDgxNDUxMDQzMTI3MzQ2.X9eUCw.pQu01QwTXumfXCMPoPXEky88Vng');