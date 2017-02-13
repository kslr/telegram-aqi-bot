
const TOKEN = process.env.TELEGRAM_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN';
const PORT = process.env.LEANCLOUD_APP_PORT || '443';
const url = process.env.APP_URL || 'YOU_SITE_URL';

const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const pinyin = require('pinyin');

const bot = new TelegramBot(TOKEN);
const app = express();

bot.setWebHook(`${url}/bot${TOKEN}`);

// parse the updates to JSON
app.use(bodyParser.json());

app.get('/', (req, res) => {
  console.info(`Your ip ${req.ip}`);
  res.sendStatus(200);
});

// We are receiving updates at the route below!
app.post(`/bot${TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`server is listening on ${PORT}`);
});

bot.onText(/^\/aqi$/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Examples: /aqi 济南|濟南|jinan');
});

bot.onText(/\/aqi (.+)/, (msg, match) => {
  let city = match[1];
  const re = /[^\u4e00-\u9fa5]|[\uFE30-\uFFA0]/;
  if (!re.test(city)) {
    city = pinyin(city, {
      segment: false,
      style: pinyin.STYLE_NORMAL,
    });
    city = city.join('');
  }

  console.log(`query ${city} city`);
  request(`http://aqicn.org/aqicn/json/android/${city}/json`, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const res = JSON.parse(body);
      if (res.wgt) {
        console.log(res.wgt);
        bot.sendPhoto(msg.chat.id, res.wgt);
      } else {
        bot.sendMessage(msg.chat.id, `Can not find ${city} city`);
      }
    } else {
      console.error(error);
    }
  });
});


bot.on('webhook_error', (error) => {
  console.log(error.response.body);
});
