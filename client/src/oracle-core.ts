import {
  CONTRACT_OWNER_PRIVATE_KEY,
  ORACLE_CONTRACT_ADDRESS,
  ORACLE_SERVICE_ADDRESS,
  RPC_URL,
  THRESHOLD,
} from './constant'
import { createContractProvider } from './helper'

const ORACLE_ABI = [
  'function addOracle(address) public',
  'function removeOracle(address) public',
  'function setThreshold(uint256) public',
  'function getLatestEthPrice() public returns (uint256)',
  'function setLatestEthPrice(uint256, address, uint256) public', // only can be called by oracle service
  'event GetLatestEthPriceEvent(address, uint256)',
  'event SetLatestEthPriceEvent(uint256, address)',
  'event AddOracleEvent(address)',
  'event RemoveOracleEvent(address)',
  'event SetThresholdEvent(uint256)',
]

async function addOracle(oracleServiceAddress: string) {
  // contract provider
  const contract = createContractProvider(
    RPC_URL,
    CONTRACT_OWNER_PRIVATE_KEY,
    ORACLE_CONTRACT_ADDRESS,
    ORACLE_ABI
  )
  // call external function
  const tx = await contract.functions['addOracle'](oracleServiceAddress)
  console.log('transaction: ', tx)
}

async function removeOracle(oracleServiceAddress: string) {
  // contract provider
  const contract = createContractProvider(
    RPC_URL,
    CONTRACT_OWNER_PRIVATE_KEY,
    ORACLE_CONTRACT_ADDRESS,
    ORACLE_ABI
  )
  // call external function
  const tx = await contract.functions['removeOracle'](oracleServiceAddress)
  console.log('transaction: ', tx)
}

async function setThreshold(threshold: string) {
  // contract provider
  const contract = createContractProvider(
    RPC_URL,
    CONTRACT_OWNER_PRIVATE_KEY,
    ORACLE_CONTRACT_ADDRESS,
    ORACLE_ABI
  )
  // call external function
  const tx = await contract.functions['setThreshold'](threshold)
  console.log('transaction: ', tx)
}

async function getLatestEthPrice(privateKey: string) {
  // contract provider
  const contract = createContractProvider(RPC_URL, privateKey, ORACLE_CONTRACT_ADDRESS, ORACLE_ABI)
  // call external function
  const tx = await contract.functions['getLatestEthPrice']()
  console.log('transaction: ', tx)
}

async function listenOracleEvent(eventFilter: string) {
  // contract provider
  const contract = createContractProvider(
    RPC_URL,
    CONTRACT_OWNER_PRIVATE_KEY,
    ORACLE_CONTRACT_ADDRESS,
    ORACLE_ABI
  )
  // listen
  contract.on(eventFilter, async (...res) => {
    console.log(res)
  })
}

// interact with oracle function
addOracle(ORACLE_SERVICE_ADDRESS).catch(console.error)
removeOracle(ORACLE_SERVICE_ADDRESS).catch(console.error)
setThreshold(THRESHOLD).catch(console.error)
getLatestEthPrice(CONTRACT_OWNER_PRIVATE_KEY).catch(console.error)

// call listen oracle contract events
listenOracleEvent('GetLatestEthPriceEvent').catch(console.error)
