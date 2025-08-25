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
```
proofpay-network/
├─ contracts/          # ProofPayNetwork.sol
├─ scripts/            # Deploy & interaction scripts
├─ hardhat.config.js   # Hardhat setup
├─ .env.example        # Template for env vars
└─ README.md
```

---

## ⚙️ Setup

1. Clone repo:
```bash
git clone https://github.com/<your-username>/proofpay-network.git
cd proofpay-network
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
```

Fill `.env`:
```ini
SEPOLIA_RPC_URL=YOUR_ALCHEMY_URL
PRIVATE_KEY=0xYOUR_METAMASK_PRIVATE_KEY
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_KEY
```

4. Compile contracts:
```bash
npx hardhat compile
```

---

## 📡 Deploy on Sepolia
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

Save the deployed `CONTRACT_ADDRESS` into `.env`.

---

## 🔍 Interact
Submit a mocked proof & verify:
```bash
npx hardhat run scripts/interact.js --network sepolia
```

Check signer info:
```bash
npx hardhat run scripts/whoami.js --network sepolia
```

---

## ⚠️ Notes
- This is **educational only** – the ZK verification is mocked.  
- Don’t use private keys from real wallets.  
- Only tested with **Sepolia ETH**.  

---

## 🛣 Future Work
- Integrate real ZK verifiers (Groth16/Plonk).  
- Frontend for proof submission & visualization.  
- Subgraph indexing for proof history.  

---

## 📜 License
MIT
