# ETHUSDT Price Oracle

Ethereum-Dollar price oracle that calls upon Binance's public API. 

## What is an oracle?

Blockchain oracles are third-party services that provide smart contracts with external information. Oracles provide a link between off-chain and on-chain data and are vital within the blockchain ecosystem because they broaden the scope in which smart contracts can operate.

![](assets/diagram.png)


# Getting Started

## Deploy smart contract
- Make sure caller and oracle smart contracts are already deployed on the chain.
## Environment variables
- Configure `.env` for `./client`
```sh
cp .env-sample .env
```

- Configure `.env` in `./server`
```sh
cd ./server
cp .env-sample .env
```
## Server
- Compile server binary
```sh
cd ./server
cargo build --release
```

- run the oracle service
```sh
cd ./server
RUST_LOG=info ./target/release/oracle-service
```

## Client
- install dependency
```sh
yarn
```
- Call `updateEthPrice` function and listen `PriceUpdatedEvent` event
```sh
yarn start client/src/caller-core.ts
```
