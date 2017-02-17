const TelegramBot = require('node-telegram-bot-api');
const pinyin = require('pinyin');
const request = require('request');

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {
  polling: true,
  onlyFirstMatch: true,
});

bot.onText(/^\/aqi$/, (msg) => {
  bot.sendMessage(msg.chat.id, '例: /aqi 济南  (城市名支持中文、繁体中文、拼音、英文)');
});

bot.onText(/\/aqi (.+)/, (msg, match) => {
  let city = match[1];
  const re = /[^\u4e00-\u9fa5]|[\uFE30-\uFFA0]/;
  if (!re.test(city)) {
    city = pinyin(city, {
      segment: true,
      style: pinyin.STYLE_NORMAL,
    });
    city = city.join('');
  }

  console.log(`query ${city} city`);
  request(`http://aqicn.org/city/${city}/cn/m`, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const imageUrl = body.match(/(http:\/\/wgt.aqicn.org\/aqiwgt\/\d+\/[a-zA-Z0-9_-]+.png)/i);
      if (imageUrl) {
        bot.sendPhoto(msg.chat.id, imageUrl[0]);
      } else {
        bot.sendMessage(msg.chat.id, `抱歉，没有找到${city}市，请检查拼写`);
      }
    } else {
      console.error(error);
    }
  });
});

bot.on('polling_error', (error) => {
  console.error(error.code);
  console.error(error.response.body);
});
