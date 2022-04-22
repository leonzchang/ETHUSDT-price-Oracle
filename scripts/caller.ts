import { Contract } from "ethers"
import { createSigner } from "./helper"
import { CONTRACT_OWNER_PRIVATE_KEY, CALLER_CONTRACT_ADDRESS, ORACLE_CONTRACT_ADDRESS, RPC_URL } from "./constant"






const CALLER_ABI = [
    "function setOracleInstanceAddress(address) public onlyOwner",
    "function updateEthPrice() public",
    "function callback(uint256, uint256) public onlyOracle"
];


async function setOracleInstanceAddress() {
    // get signer of contract owner
    const contractOwner = createSigner(RPC_URL, CONTRACT_OWNER_PRIVATE_KEY)
    // contract provider
    const contract = new Contract(CALLER_CONTRACT_ADDRESS, CALLER_ABI, contractOwner)
    // call external function
    let tx = await contract.functions['setOracleInstanceAddress'](ORACLE_CONTRACT_ADDRESS)
    console.log('transaction: ', tx)
}

async function updateEthPrice() {
    // get signer of contract owner
    const contractOwner = createSigner(RPC_URL, CONTRACT_OWNER_PRIVATE_KEY)
    // contract provider
    const contract = new Contract(CALLER_CONTRACT_ADDRESS, CALLER_ABI, contractOwner)
    // call external function
    let tx = await contract.functions['updateEthPrice']()
    console.log('transaction: ', tx)
}


async function listenEthPrice() {
    // get signer of contract owner
    const contractOwner = createSigner(RPC_URL, CONTRACT_OWNER_PRIVATE_KEY)
    // contract provider
    const contract = new Contract(CALLER_CONTRACT_ADDRESS, CALLER_ABI, contractOwner)
    // listen 
    contract.on("PriceUpdatedEvent", (ethPrice, id) => {
        console.log(ethPrice, id);
    });

}



listenEthPrice().catch(console.error)

