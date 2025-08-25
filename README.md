# ProofPay Network

An educational Hardhat-based project demonstrating a proof-submission and verification flow for user balances on Ethereum (Sepolia). The verification is intentionally mocked to keep the focus on architecture and integration patterns.

## Table of Contents
1. Overview
2. Tech Stack
3. Architecture
4. Project Structure
5. Environment & Configuration
6. Install & Build
7. Networks & Hardhat Config
8. Deploy (Sepolia)
9. Interact & Scripts
10. Contract API
11. Events
12. Programmatic Usage (Ethers.js)
13. Testing (Guidance)
14. Troubleshooting
15. Security Notes
16. Roadmap / Ideas
17. GitHub: Initialize & Push
18. License

---

## 1) Overview
- **Goal**: Demonstrate submitting a balance proof, storing it on-chain, and simulating automatic verification.
- **Scope**: The verification logic is mocked (no real ZK verification). It flips to “verified” if `publicHash > 0`.
- **Use cases**: Tutorials, prototyping integration points, and scaffolding for a real ZK verification pipeline.

## 2) Tech Stack
- **Solidity**: Smart contract (`contracts/ProofPayNetwork.sol`).
- **Hardhat**: Development framework (compile, run, deploy, verify).
- **Ethers.js** (via Hardhat): Scripted interactions and provider/wallet handling.
- **dotenv**: Environment variable management.

## 3) Architecture
- **Contract** stores proofs by ID (hash) along with metadata (prover, requiredAmount, timestamp, verified).
- **Mappings** track user-to-proof IDs and proofId-to-proof details.
- **Flow**:
  1. Submit proof → Contract emits `ProofSubmitted` and stores data.
  2. Contract simulates verification → Sets `verified = true` if `publicHash > 0`, then emits `ProofVerified`.
  3. Off-chain scripts can query `getUserProofs`, `getProof`, or `hasValidProof` (24h freshness + amount check).

## 4) Project Structure
```
proofpay-network/
├─ contracts/
│  └─ ProofPayNetwork.sol        # Core contract
├─ scripts/
│  ├─ deploy.js                  # Deploy to Sepolia
│  ├─ interact.js                # Example: submit proof + read back data
│  └─ whoami.js                  # Prints signer info for sanity check
├─ artifacts/                    # Hardhat build outputs (ignored by git)
├─ cache/                        # Hardhat cache (ignored by git)
├─ .env                          # Local secrets (ignored by git)
├─ .env.example                  # Public template for env variables
├─ hardhat.config.js             # Hardhat networks & plugins
├─ package.json                  # Scripts and dependencies
└─ README.md                     # This file
```

## 5) Environment & Configuration
Create `.env` by copying the example and filling in values:
```bash
# Windows PowerShell
Copy-Item .env.example .env
```

`.env` keys:
```ini
SEPOLIA_RPC_URL=YOUR_ALCHEMY_OR_INFURA_URL
PRIVATE_KEY=0xYOUR_WALLET_PRIVATE_KEY
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY
# Optional after deploy
CONTRACT_ADDRESS=0xYourDeployedContractAddress
```
- **SEPOLIA_RPC_URL**: RPC endpoint (Alchemy/Infura).
- **PRIVATE_KEY**: Wallet with test ETH on Sepolia.
- **ETHERSCAN_API_KEY**: Enables contract verification.
- **CONTRACT_ADDRESS**: Filled after deployment for interaction scripts.

## 6) Install & Build
```bash
npm install
npm run compile
```

## 7) Networks & Hardhat Config
- The project is wired for **Sepolia**. Ensure your `hardhat.config.js` references `SEPOLIA_RPC_URL` and `PRIVATE_KEY` from `.env`.
- To add another network, extend the `networks` section in `hardhat.config.js` with its RPC and account(s).

## 8) Deploy (Sepolia)
```bash
npm run deploy
```
- Runs `hardhat run scripts/deploy.js --network sepolia`.
- Prints the deployed address.
- If `ETHERSCAN_API_KEY` is set, deployment script can verify on Etherscan after confirmations.
- Save the address to `.env` as `CONTRACT_ADDRESS` for later use.

## 9) Interact & Scripts
- Set `CONTRACT_ADDRESS` in `.env`.
- Example interaction:
```bash
npx hardhat run scripts/interact.js --network sepolia
```
What it does:
- **Submits** a mocked proof with sample inputs.
- **Waits** for confirmation.
- **Reads** back your proof IDs and logs them.

Other helper:
```bash
npx hardhat run scripts/whoami.js --network sepolia
```
- Prints the active signer address (from `.env.PRIVATE_KEY`).

## 10) Contract API
Location: `contracts/ProofPayNetwork.sol`

- **Structs**
  - `BalanceProof`:
    - `a: uint256[2]`
    - `b: uint256[2][2]`
    - `c: uint256[2]`
    - `requiredAmount: uint256`
    - `publicHash: uint256`
    - `prover: address`
    - `timestamp: uint256`
    - `verified: bool`

- **State**
  - `mapping(bytes32 => BalanceProof) proofs`
  - `mapping(address => bytes32[]) userProofs`

- **Events**
  - `ProofSubmitted(bytes32 proofId, address prover, uint256 requiredAmount, uint256 timestamp)`
  - `ProofVerified(bytes32 proofId, address verifier, bool isValid)`

- **Functions**
  1. `submitProof(uint256[2] _a, uint256[2][2] _b, uint256[2] _c, uint256 _requiredAmount, uint256 _publicHash) returns (bytes32 proofId)`
     - Stores a new proof and triggers internal verification.
     - Returns the generated `proofId` (keccak over sender, publicHash, block data).

  2. `verifyProof(bytes32 _proofId)`
     - Re-runs internal verification for a stored proof.

  3. `getProof(bytes32 _proofId) view returns (uint256 requiredAmount, uint256 publicHash, address prover, uint256 timestamp, bool verified)`
     - Reads key metadata for an existing proof.

  4. `getUserProofs(address _user) view returns (bytes32[] memory)`
     - Lists all proof IDs previously submitted by the user.

  5. `hasValidProof(address _user, uint256 _requiredAmount) view returns (bool)`
     - True if user has a `verified` proof with `requiredAmount >= _requiredAmount` and `timestamp` within last 24 hours.

## 11) Events
Example: listen for events off-chain using Ethers.js.
```javascript
// scripts/listen.js (example snippet)
const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const addr = process.env.CONTRACT_ADDRESS;
  const ProofPay = await hre.ethers.getContractFactory("ProofPayNetwork");
  const contract = ProofPay.attach(addr);

  contract.on("ProofSubmitted", (proofId, prover, amount, ts) => {
    console.log("ProofSubmitted", { proofId, prover, amount: amount.toString(), ts: ts.toString() });
  });

  contract.on("ProofVerified", (proofId, verifier, isValid) => {
    console.log("ProofVerified", { proofId, verifier, isValid });
  });

  console.log("Listening...");
}

main().catch(console.error);
```
Run:
```bash
npx hardhat run scripts/listen.js --network sepolia
```

## 12) Programmatic Usage (Ethers.js)
Use artifacts to build a frontend or additional scripts.
```javascript
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

// Load ABI from artifacts
const abi = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../artifacts/contracts/ProofPayNetwork.sol/ProofPayNetwork.json"),
    "utf8"
  )
).abi;

const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

(async () => {
  // Submit a mocked proof
  const tx = await contract.submitProof(
    [1, 2],
    [[3, 4], [5, 6]],
    [7, 8],
    ethers.utils.parseEther("1"),
    123456 // publicHash > 0 → verified in this demo
  );
  await tx.wait();

  // Check validity
  const ok = await contract.hasValidProof(await wallet.getAddress(), ethers.utils.parseEther("1"));
  console.log("hasValidProof:", ok);
})();
```

## 13) Testing (Guidance)
- No tests are included yet. Suggested steps:
  1. Add `@nomicfoundation/hardhat-chai-matchers` if not already in the toolbox.
  2. Create `test/proofpay.spec.js` with scenarios: submitProof → verify flag set; hasValidProof true/false for amounts and 24h window.
  3. Run tests: `npx hardhat test`.

Sample outline:
```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProofPayNetwork", function () {
  it("marks proof verified when publicHash > 0", async function () {
    const Factory = await ethers.getContractFactory("ProofPayNetwork");
    const c = await Factory.deploy();
    await c.deployed();

    const tx = await c.submitProof([1,2], [[3,4],[5,6]], [7,8], ethers.utils.parseEther("1"), 1);
    await tx.wait();

    const [user] = await ethers.getSigners();
    const ids = await c.getUserProofs(user.address);
    const id = ids[0];
    const proof = await c.getProof(id);
    expect(proof.verified).to.equal(true);
  });
});
```

## 14) Troubleshooting
- **insufficient funds for gas**: Ensure your Sepolia account has test ETH.
- **invalid opcode or revert**: Double-check parameters and that `CONTRACT_ADDRESS` matches the deployed instance.
- **Etherscan verification fails**:
  - Confirm `ETHERSCAN_API_KEY` is set.
  - Make sure the compiler version and settings in `hardhat.config.js` match deployment.
  - Wait for a few block confirmations and retry.
- **Cannot find artifacts**: Run `npm run compile` first. Ensure paths are correct.

## 15) Security Notes
- Verification is mocked and not secure. Do not use as-is for production.
- Never commit secrets. `.env` is excluded by `.gitignore`; use `.env.example` for placeholders.
- Review access control: current design allows any caller to `verifyProof` (by design for demo).

## 16) Roadmap / Ideas
- Integrate a real verifier contract generated by zk systems (e.g., Groth16/Plonk from Circom/SnarkJS).
- Add subgraph indexing for proofs and users.
- Build a simple frontend to submit proofs and visualize history.
- Enhance time window and amount thresholds as parameters.
- Add unit/integration tests and CI (GitHub Actions).

## 17) GitHub: Initialize & Push
```bash
# Initialize (first-time only)
git init
git add .
git commit -m "Initial commit: ProofPay Network"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo>.git
git push -u origin main
```

## 18) License
MIT