const express = require('express');
const logger = require('morgan');
const createError = require('http-errors');
const axios = require('axios');
const cron = require("node-cron");
const Redis = require('redis');
const redis = Redis.createClient();
redis.on('error', (err) => {
  console.log("Error " + err);
});


const index = require('./routes/index');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

cron.schedule("*/1 * * * *", async () => {
  const coinbase_res = await axios.get('https://api.coinbase.com/v2/exchange-rates?currency=USDC');
  const coingecko_res = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=cny');
  const coinbase_price = coinbase_res.data.data.rates.CNY;
  const coingecko_price = coingecko_res.data['usd-coin'].cny;
  const price = ((Number(coinbase_price) + Number(coingecko_price)) / 2 ).toFixed(6);
  const timestamp = Math.floor(Date.now() / 1000 / 60) * 60;

  redis.set(timestamp, price);
  redis.expire(timestamp, 60 * 60 * 24 * 30);
});

module.exports = app;
