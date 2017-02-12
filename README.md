# Telegram AQI Bot

Telegram AQI Bot based on nodejs

##Install

因为该类型服务使用频率低、稳定性要求高等特点，推荐使用LeanCloud, openShift, Heroku等平台部署，这可以完美的利用免费额度。

另外为了躲避休眠机制造成的影响，使用WebHook与Telegram Bot服务器通联，因此需要一个支持https的公网地址，这些平台都默认已提供。如果你单独部署在服务器，请不要忘记这点。

| 环境变量               |         示例         |             描述             |
| ------------------ | :----------------: | :------------------------: |
| TELEGRAM_TOKEN     |     xxxx:xxxx      |      Telegram机器人Token      |
| LEANCLOUD_APP_PORT |        443         |            监听端口            |
| APP_URL            | https://domain.com | 如果有了新消息，Telegram就会往该地址发送消息 |


```
git clone https://github.com/kslr/telegram-aqi-bot.git
node server.js
```

## Usage

可搜索用户"@AirPollution_Bot"测试。

![images](https://github.com/kslr/telegram-aqi-bot/raw/master/screenshots/01.png)


## Support

If you are having problems with telegram-aqi-bot, please raise an
[issue on github](https://github.com/kslr/telegram-aqi-bot/issues).

## License

Please see the [LICENSE](LICENSE.md) included in this repository for a full copy of the MIT license,
which this project is licensed under.