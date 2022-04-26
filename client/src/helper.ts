import { Contract, ethers } from 'ethers'

export function createSigner(rpcUrl: string, privateKey: string) {
  // create RPC provider
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
  // return signer
  return new ethers.Wallet(privateKey, provider)
}

export function createContractProvider(
  rpcUrl: string,
  privateKey: string,
  contractAddress: string,
  abi: string[]
) {
  // get signer of contract owner
  const contractOwner = createSigner(rpcUrl, privateKey)
  // return contract provider
  return new Contract(contractAddress, abi, contractOwner)
}
