mod contract;
mod utils;
use contract::EthPriceOracle;
use dotenv::dotenv;
use ethers::{prelude::Address, providers::Middleware};
use eyre::Result;
use std::env;
use std::{str::FromStr, sync::Arc};
use utils::create_signer;

#[derive(serde::Deserialize, Debug)]
struct Price {
    symbol: String,
    price: String,
}

#[tokio::main]
async fn main() -> Result<()> {
    // configure env
    dotenv().ok();

    // oracle signer
    let oracle_signer = create_signer(
        env::var("RPC_URL").unwrap(),
        env::var("ORACLE_SERVICE_PRIVATE_KEY").unwrap(),
    )
    .await
    .expect("can not create signer!");

    // contract address
    let caller_contract_address = Address::from_str(env::var("CALLER_CONTRACT_ADDRESS").unwrap())
        .expect("Address decoding failed");
    let eth_price_oracle_address = Address::from_str(env::var("ORACLE_CONTRACT_ADDRESS").unwrap())
        .expect("Address decoding failed");

    // get current block
    let current_blocks = oracle_signer.get_block_number();

    // get contract provider with signer
    let arc_signer = Arc::new(oracle_signer.clone());
    let oracle_provider = EthPriceOracle::new(eth_price_oracle_address, arc_signer.clone());

    // listen oracle event
    let logs = oracle_provider
        .get_latest_eth_price_event_filter()
        .from_block(18665486)
        .query()
        .await?;

    println!("logs: {:?}", logs);

    // fetch api and get ETHUSDT
    let request_url = format!(env::var("BINANCE_API").unwrap());
    let response = reqwest::get(&request_url).await?;
    let data: Vec<Price> = response.json().await?;
    let rate = data
        .into_iter()
        .filter(|token| token.symbol == env::var("TOKEN_SYMBOL").unwrap())
        .collect::<Vec<Price>>();

    let price = rate[0].price.parse::<f32>()?.round() as i32;
    // .unwrap_or_else(|_| U256::zero());

    println!("prices: {:?}", price);

    println!("who am I: {:?}", oracle_signer.address());
    // update Oracle ETHUSDT price
    let res = oracle_provider
        .set_latest_eth_price(price.into(), caller_contract_address, logs[0].id)
        .legacy()
        .send()
        .await?
        .await?;
    println!("prices: {:?}", res);
    Ok(())
}

// loop {
//     delay_for(Duration::from_millis(1000)).await;
//     call_me();
// }

// // create tx
// let tx = TransactionRequest::new().to(to).value(1000);
// println!("tx: {:?}", tx);

// // send tx
// let tx_hash = signer.send_transaction(tx, None).await?.await?;
// println!("tx_hash: {:?}", tx_hash);
