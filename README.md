# 🔐 ProofPay Network

> *"It's like a system that can’t lie but won’t tell the truth either."*

ProofPay Network is a minimal educational project that demonstrates how **zero-knowledge proofs** can be used to verify whether a wallet has a required amount of ETH **without ever revealing the actual balance**.  

This demo uses:
- **Metamask account key** (for signing & interaction)  
- **Alchemy RPC** (Sepolia testnet)  
- **Etherscan API** (for contract verification)  

The verification logic here is mocked, but the flow simulates what a real ZK pipeline would look like.

---

## 🚀 What It Does
- Proves you have at least `X` Sepolia ETH  
- Without disclosing your real balance  
- Stores and verifies proof on-chain  
- Uses Hardhat + Solidity for smart contract flow  

---

## 🛠 Tech Stack
- **Solidity** – Smart contracts  
- **Hardhat** – Development & deployment  
- **Ethers.js** – Interactions & scripting  
- **Alchemy RPC** – Sepolia testnet provider  
- **Etherscan API** – Contract verification  
- **dotenv** – Environment management  

---

## 📂 Project Structure
