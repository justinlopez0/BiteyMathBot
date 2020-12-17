'use strict';

// Using .env file to store discord token
require('dotenv').config({path:__dirname+'/.env'});

const {
  performance
} = require('perf_hooks');

const Discord = require('discord.js');
let sqlite3 = require('sqlite3').verbose();
let Stats = require('./models/Stats.js');
let FastestAnswer = require('./models/FastestAnswer.js');

const client = new Discord.Client();

let db = new sqlite3.Database(__dirname+'/bitey_math_bot.db');

// Models
const stats = new Stats(db);
const fastestAnswer = new FastestAnswer(db);
//const settings = new Settings.Settings(db);

let settings = {
  commandPrefix: '!',
  channel: 'math-and-math',
  minNumber: 1,
  maxNumber: 10,
  //@todo mathType: 'addition',
  roundInterval: 6000,
  unansweredRoundsLimit: 5 // Amount of unanswered rounds before the bot will stop
}

let gameLoop = null;
let question = '';
let answer = '';
let unansweredRounds = 0;
let isAnswered = false;
let started = false;
let questionStartTime = 0;
let questionEndTime = 0;

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  if (message.channel.name !== settings.channel) return;
  
  let baseCommand = message.content.split(settings.commandPrefix)[1];

  if (answer == message.content && answer != '') {
    let questionEndTime = performance.now();
    message.channel.send('Good job **' + message.author.username + '**! You are correct! (' + ((questionEndTime - questionStartTime)/1000).toFixed(4) + 's)');
    unansweredRounds = 0;
    isAnswered = true;
    
    // Record correct answer to stats table
    stats.addScore(message.author.username, question, answer);

  }

  switch(baseCommand) {
      case 'start':
          // If bot is already started, no need to start it again
          if (started) break;

          message.channel.send('Game will start in ' + (settings.roundInterval / 1000) + ' seconds!');
          console.log('Starting game');

          gameLoop = setInterval(() => {
            questionStartTime = performance.now();
            isAnswered = false;
            let firstNumber = between(settings.minNumber, settings.maxNumber);
            let secondNumber = between(settings.minNumber, settings.maxNumber);

            question = 'What is ' + firstNumber + ' + ' + secondNumber + '?';
            message.channel.send(question);
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
          // If bot is already stopped, no need to stop it again
          if(!started) break;
          stopBot();
          message.channel.send('Game has ended!');
          console.log('Stopping game');
          break;
      case 'top':
          stats.getTopScores(5, function(scores) {
            let topScores = '';
            scores.forEach(function(score) {
              topScores += '**' + score.score + '** - ' + score.user + '\n';
            });

            const topScoreEmbed = new Discord.MessageEmbed()
              .setColor('#ffffff')
              .setTitle('Top Scores')
              .setDescription(topScores);

          
            message.channel.send(topScoreEmbed);
          });
  }

});

function stopBot() {
  clearInterval(gameLoop);
  started = false;
}

// Return an integer between min and max
function between(min, max) {  
  return Math.floor(
    Math.random() * (max - min) + min
  )
}

client.login(process.env.DISCORD_TOKEN);