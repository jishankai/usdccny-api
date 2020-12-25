var express = require('express');
var router = express.Router();
const axios = require('axios');
const Redis = require('redis');
const redis = Redis.createClient();
redis.on('error', (err) => {
  console.log("Error " + err);
});

router.get('/usdccny', async function(req, res, next) {
  const coinbase_res = await axios.get('https://api.coinbase.com/v2/exchange-rates?currency=USDC');
  const coingecko_res = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=cny');
  const coinbase_price = coinbase_res.data.data.rates.CNY;
  const coingecko_price = coingecko_res.data['usd-coin'].cny;
  const price = ((Number(coinbase_price) + Number(coingecko_price)) / 2 ).toFixed(6);

  res.json({
    price
  });
});

router.get('/usdccny/:timestamp', async function(req, res, next) {
  const timestamp = Math.floor(req.params.timestamp / 60) * 60;
  redis.get(timestamp, (err, price)=>{
    res.json({
      price
    });
  });
});

module.exports = router;
