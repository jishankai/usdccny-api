# USDCCNY Live & Historical API
***powered by [Coinbase](https://coinbase.com), [CoinGecko](https://www.coingecko.com/)***

Since Coinbase and CoinGecko doesn't have a historical API for USDC/CNY price,
this functions as a workaround to cache and provide historical snapshots via a API.

## Instruction

### Redis

Use `Redis` as storage. You can start a redis server with docker.

```
docker run -p 6379:6379 -d redis redis-server --appendonly yes
```

### Run

```
npm install & npm start
```

### Endpoints

#### Live

```
curl http://127.0.0.1:3000/usdccny
```

Response:

```
{
    price: 6.543210
}
```

#### Historical

```
curl http://127.0.0.1:3000/usdccny/{timestamp}
```

Response:

```
{
    price: 6.543210
}
```

## License

None.

