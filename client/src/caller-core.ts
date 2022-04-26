import {
  CALLER_CONTRACT_ADDRESS,
  CONTRACT_OWNER_PRIVATE_KEY,
  ORACLE_CONTRACT_ADDRESS,
  RPC_URL,
} from './constant'
import { createContractProvider } from './helper'

const CALLER_ABI = [
  'function setOracleInstanceAddress(address) public onlyOwner',
  'function updateEthPrice() public',
  'function callback(uint256, uint256) public onlyOracle', // only can be called by oracle smart contract
  'event newOracleAddressEvent(address)',
  'event ReceivedNewRequestIdEvent(uint256)',
  'event PriceUpdatedEvent(uint256, uint256)',
]

async function setOracleInstanceAddress(oracleAddress: string) {
  // contract provider
  const contract = createContractProvider(
    RPC_URL,
    CONTRACT_OWNER_PRIVATE_KEY,
    CALLER_CONTRACT_ADDRESS,
    CALLER_ABI
  )
  // call external function
  const tx = await contract.functions['setOracleInstanceAddress'](oracleAddress)
  console.log('transaction: ', tx)
}

async function updateEthPrice() {
  // contract provider
  const contract = createContractProvider(
    RPC_URL,
    CONTRACT_OWNER_PRIVATE_KEY,
    CALLER_CONTRACT_ADDRESS,
    CALLER_ABI
  )
  // call external function
  const tx = await contract.functions['updateEthPrice']()
  console.log('transaction: ', tx)
}

async function listenCallerEvent(eventFilter: string) {
  // contract provider
  const contract = createContractProvider(
    RPC_URL,
    CONTRACT_OWNER_PRIVATE_KEY,
    CALLER_CONTRACT_ADDRESS,
    CALLER_ABI
  )
  // listen
  contract.on(eventFilter, async (...res) => {
    console.log(res)
  })
}

// interact with caller function
setOracleInstanceAddress(ORACLE_CONTRACT_ADDRESS).catch(console.error) // comment this line before run the example in README
updateEthPrice().catch(console.error)

// call listen caller contract events
listenCallerEvent('PriceUpdatedEvent').catch(console.error)
