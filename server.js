'use strict'

const TOKEN = process.env.TELEGRAM_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';
const PORT = process.env.LEANCLOUD_APP_PORT || '443';
const url = process.env.APP_URL || 'YOU_SITE_URL';

const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const pinyin = require("pinyin");
const bot = new TelegramBot(TOKEN);
const app = express();

bot.setWebHook(`${url}/bot${TOKEN}`);

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

bot.onText(/^\/aqi$/, function (msg) {
  bot.sendMessage(msg.chat.id, 'Examples: /aqi beijing');
});

bot.onText(/\/aqi (.+)/, function (msg, match) {
    var city = match[1];
    var re = /[^\u4e00-\u9fa5]|[\uFE30-\uFFA0]/;
    if(re.test(city)) {
        city = pinyin(city, {
            segment: false,
            style: pinyin.STYLE_NORMAL
        });
        city.replace(/\s+/g,"");
    }

    console.log(`query ${city} city`);
    request(`http://aqicn.org/aqicn/json/android/${city}/json`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var res = JSON.parse(body);
            if (res.wgt) {
                console.log(res.wgt);
                bot.sendPhoto(msg.chat.id, res.wgt);
            } else {
                bot.sendMessage(msg.chat.id, `Can not find ${city} city`);
            }
        } else {
            console.error(error);
        }
    })
});