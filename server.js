const config = require('./config');
const TelegramBot = require('node-telegram-bot-api');
const pinyin = require('pinyin');
const request = require('request');

const bot = new TelegramBot(config.token, {
  polling: true,
  onlyFirstMatch: true,
});

bot.onText(/^\/aqi$/, (msg) => {
  bot.sendMessage(msg.chat.id, config.tips);
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
        bot.sendMessage(msg.chat.id, config.not_find_city_tips);
      }
    } else {
      console.error(error);
    }
  });
});

bot.onText(/(.+)/, (msg) => {
  bot.sendMessage(msg.chat.id, config.tips);
});


bot.on('polling_error', (error) => {
  console.error(error.code);
  console.error(error.response.body);
});
