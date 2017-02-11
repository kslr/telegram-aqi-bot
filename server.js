'use strict'

const TOKEN = process.env.TELEGRAM_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';
const PORT = process.env.LEANCLOUD_APP_PORT || '443';
const url = process.env.APP_URL || 'YOU_SITE_URL';

const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');
const options = {
  webHook: {
    port: PORT
  }
};


const bot = new TelegramBot(TOKEN, options);

bot.setWebHook(`${url}/bot${TOKEN}`);

const app = express();

// parse the updates to JSON
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.sendStatus(200);
});

// We are receiving updates at the route below!
app.post(`/bot${TOKEN}`, function (req, res) {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Express server is listening on ${PORT}`)
});

bot.on('message', function onMessage(msg) {
    bot.sendMessage(msg.chat.id, 'I am alive!');
});
