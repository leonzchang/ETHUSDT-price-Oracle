import { ethers } from "ethers"

export function createSigner(rpcUrl: string, privateKey: string) {
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
    return new ethers.Wallet(privateKey, provider);
}