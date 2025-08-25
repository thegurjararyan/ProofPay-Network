const hre = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS || "YOUR_DEPLOYED_CONTRACT_ADDRESS";
  const [signer] = await hre.ethers.getSigners();

  console.log("🧪 Testing ProofPayNetwork contract... as:", await signer.getAddress());

  const ProofPayNetwork = await hre.ethers.getContractFactory("ProofPayNetwork");
  const proofPay = ProofPayNetwork.attach(contractAddress);

  const mockProof = {
    a: [1, 2],
    b: [ [3, 4], [5, 6] ],
    c: [7, 8],
    requiredAmount: hre.ethers.utils.parseEther("1000"),
    publicHash: 12345
  };

  const tx = await proofPay.submitProof(
    mockProof.a,
    mockProof.b,
    mockProof.c,
    mockProof.requiredAmount,
    mockProof.publicHash
  );

  console.log("📝 Transaction hash:", tx.hash);
  await tx.wait();
  console.log("✅ Proof submitted successfully!");

  const userProofs = await proofPay.getUserProofs(await signer.getAddress());
  console.log("📊 User proofs:", userProofs);
}

main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});