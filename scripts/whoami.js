const hre = require("hardhat");

async function main() {
  const provider = new hre.ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const wallet = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const balance = await provider.getBalance(wallet.address);
  console.log("Deployer address:", wallet.address);
  console.log("Sepolia balance:", hre.ethers.utils.formatEther(balance), "ETH");
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });