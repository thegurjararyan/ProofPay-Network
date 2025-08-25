const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying ProofPayNetwork to Sepolia testnet...");

  const ProofPayNetwork = await hre.ethers.getContractFactory("ProofPayNetwork");
  const proofPayNetwork = await ProofPayNetwork.deploy();
  await proofPayNetwork.deployed();

  console.log("✅ ProofPayNetwork deployed to:", proofPayNetwork.address);
  console.log("🔗 View on Etherscan:", `https://sepolia.etherscan.io/address/${proofPayNetwork.address}`);

  console.log("⏳ Waiting for 6 block confirmations before verification...");
  await proofPayNetwork.deployTransaction.wait(6);

  console.log("🔍 Verifying contract on Etherscan...");
  try {
    await hre.run("verify:verify", {
      address: proofPayNetwork.address,
      constructorArguments: [],
    });
    console.log("✅ Contract verified on Etherscan!");
  } catch (error) {
    console.log("❌ Verification failed:", error.message);
  }

  console.log("\n📝 Contract Details:");
  console.log("Address:", proofPayNetwork.address);
  console.log("Network: Sepolia Testnet");
  console.log("Explorer:", `https://sepolia.etherscan.io/address/${proofPayNetwork.address}`);
  console.log("\n🎉 Deployment complete!");
}

main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});