use ethers::{
    core::k256::ecdsa::SigningKey,
    middleware::SignerMiddleware,
    providers::{Http, Middleware, Provider},
    signers::{LocalWallet, Signer, Wallet},
};
use std::str::FromStr;

pub async fn create_signer(
    rpc_url: &str,
    private_key: &str,
) -> Result<SignerMiddleware<Provider<Http>, Wallet<SigningKey>>, &'static str> {
    let provider =
        Provider::<Http>::try_from(rpc_url).map_err(|_| "could not instantiate HTTP provider")?;

    // get chain ID
    // error handling
    let chain_id = provider
        .get_chainid()
        .await
        .map(|id| id.as_u64())
        .map_err(|_| "fail to get chain ID")?;

    // wallet configuration
    let wallet = LocalWallet::from_str(private_key)
        .map_err(|_| "fail to configure signer")?
        .with_chain_id(chain_id);

    Ok(SignerMiddleware::new(provider, wallet))
}
