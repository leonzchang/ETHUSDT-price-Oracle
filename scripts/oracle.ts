import { Contract } from "ethers"
import { createSigner } from "./helper"
import { CONTRACT_OWNER_PRIVATE_KEY, ORACLE_CONTRACT_ADDRESS, ORACLE_SERVICE_ADDRESS, RPC_URL, THRESHOLD } from "./constant"


const ORACLE_ABI = [
    "function addOracle(address) public",
    "function removeOracle(address) public",
    "function setThreshold(uint256) public",
    "function getLatestEthPrice() public returns (uint256)",
    "function setLatestEthPrice(uint256, address, uint256) public"
];


async function addOracle() {
    // get signer of contract owner
    const contractOwner = createSigner(RPC_URL, CONTRACT_OWNER_PRIVATE_KEY)
    // contract provider
    const contract = new Contract(ORACLE_CONTRACT_ADDRESS, ORACLE_ABI, contractOwner)
    // call external function
    let tx = await contract.functions['addOracle'](ORACLE_SERVICE_ADDRESS)
    console.log('transaction: ', tx)
}

async function setThreshold() {
    // get signer of contract owner
    const contractOwner = createSigner(RPC_URL, CONTRACT_OWNER_PRIVATE_KEY)
    // contract provider
    const contract = new Contract(ORACLE_CONTRACT_ADDRESS, ORACLE_ABI, contractOwner)
    // call external function
    let tx = await contract.functions['setThreshold'](THRESHOLD)
    console.log('transaction: ', tx)
}

async function removeOracle() {
    // get signer of contract owner
    const contractOwner = createSigner(RPC_URL, CONTRACT_OWNER_PRIVATE_KEY)
    // contract provider
    const contract = new Contract(ORACLE_CONTRACT_ADDRESS, ORACLE_ABI, contractOwner)
    // call external function
    let tx = await contract.functions['removeOracle'](ORACLE_SERVICE_ADDRESS)
    console.log('transaction: ', tx)
}

removeOracle().catch(console.error)