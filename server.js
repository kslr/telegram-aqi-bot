'use strict'

const TOKEN = process.env.TELEGRAM_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';
const TelegramBot = require('node-telegram-bot-api');
const options = {
  webHook: {
    port: process.env.LEANCLOUD_APP_PORT || 'YOU_LISTEN_PROT'
  }
};


const url = process.env.APP_URL || 'YOU_SITE_URL';
const bot = new TelegramBot(TOKEN, options);


bot.setWebHook(`${url}/bot${TOKEN}`);


// Just to ping!
bot.on('message', function onMessage(msg) {
  bot.sendMessage(msg.chat.id, 'I am alive!');
});


bot.on('webhook_error', (error) => {
    console.error(error.code);
});