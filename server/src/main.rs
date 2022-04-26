mod contract;
mod utils;
use contract::EthPriceOracle;
use dotenv_codegen::dotenv;
use ethers::{prelude::Address, providers::Middleware};
use log::{info, warn};
use std::{str::FromStr, sync::Arc};
use tokio::time::{sleep, Duration};
use utils::create_signer;

#[derive(serde::Deserialize, Debug)]
struct Price {
    symbol: String,
    price: String,
}

// TODO: error handling
#[tokio::main]
async fn main() {
    // configure env logger
    env_logger::init();

    info!("oracle service started...");
    // create oracle signer
    let oracle_signer = create_signer(dotenv!("RPC_URL"), dotenv!("ORACLE_SERVICE_PRIVATE_KEY"))
        .await
        .expect("can not create signer!");

    // initial contract address
    let caller_contract_address =
        Address::from_str(dotenv!("CALLER_CONTRACT_ADDRESS")).expect("Address decoding failed");
    let eth_price_oracle_address =
        Address::from_str(dotenv!("ORACLE_CONTRACT_ADDRESS")).expect("Address decoding failed");

    // initial header
    let mut fetch_from_blocks = oracle_signer
        .get_block_number()
        .await
        .expect("can not get the block number");

    // get contract provider with signer
    let arc_signer = Arc::new(oracle_signer.clone());
    let oracle_provider = EthPriceOracle::new(eth_price_oracle_address, arc_signer);

    // HACK: handle event need to be refactored in a better way
    // handle update event
    info!("Handle event...");
    loop {
        // listen oracle event
        let requests = oracle_provider
            .get_latest_eth_price_event_filter()
            .from_block(fetch_from_blocks)
            .query()
            .await
            .expect("fail to get latest ETH price event");

        //record last time fechted blocks number
        fetch_from_blocks = oracle_signer
            .get_block_number()
            .await
            .expect("can not get the block number");

        info!("Requests in queue: {:?}", requests);

        // if there is any event
        if !requests.is_empty() {
            // fetch api and get ETHUSDT
            let request_url = dotenv!("BINANCE_API").to_string();
            let response = reqwest::get(&request_url)
                .await
                .expect("can not fetch BINANCE API");
            let data: Vec<Price> = response.json().await.unwrap();
            let rate = data
                .into_iter()
                .filter(|token| token.symbol == dotenv!("TOKEN_SYMBOL"))
                .collect::<Vec<Price>>();

            let price = rate[0]
                .price
                .parse::<f32>()
                .expect("price format parse error")
                .round() as i32;

            info!("ETHUSDT price: {}", price);

            // update Oracle ETHUSDT price
            for request in requests {
                oracle_provider
                    .set_latest_eth_price(price.into(), caller_contract_address, request.id)
                    .legacy()
                    .send()
                    .await
                    .expect("can not set latest ETH price");

                info!("id {} resolved.", request.id);
            }
        } else {
            warn!("No requests in queue...");
        }
        // wait for 10 sec after updating price to smart contract
        sleep(Duration::from_millis(10000)).await;
    }
}
