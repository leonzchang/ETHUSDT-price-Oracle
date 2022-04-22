import dotenv from 'dotenv'
dotenv.config()

// account
export const CONTRACT_OWNER_PRIVATE_KEY = process.env.CONTRACT_OWNER_PRIVATE_KEY

// rpc url
export const RPC_URL = process.env.RPC_URL

// contract address
export const CALLER_CONTRACT_ADDRESS = process.env.CALLER_CONTRACT_ADDRESS
export const ORACLE_CONTRACT_ADDRESS = process.env.ORACLE_CONTRACT_ADDRESS

// oracle service address
export const ORACLE_SERVICE_ADDRESS = process.env.ORACLE_SERVICE_ADDRESS

// oracle contract threshold
export const THRESHOLD = process.env.THRESHOLD