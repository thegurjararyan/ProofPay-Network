// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ProofPayNetwork {
    struct BalanceProof {
        uint256[2] a;
        uint256[2][2] b;
        uint256[2] c;
        uint256 requiredAmount;
        uint256 publicHash;
        address prover;
        uint256 timestamp;
        bool verified;
    }

    mapping(bytes32 => BalanceProof) public proofs;
    mapping(address => bytes32[]) public userProofs;

    event ProofSubmitted(
        bytes32 indexed proofId,
        address indexed prover,
        uint256 requiredAmount,
        uint256 timestamp
    );

    event ProofVerified(
        bytes32 indexed proofId,
        address indexed verifier,
        bool isValid
    );

    function submitProof(
        uint256[2] memory _a,
        uint256[2][2] memory _b,
        uint256[2] memory _c,
        uint256 _requiredAmount,
        uint256 _publicHash
    ) external returns (bytes32 proofId) {
        proofId = keccak256(
            abi.encodePacked(
                msg.sender,
                _publicHash,
                block.timestamp,
                block.number
            )
        );

        proofs[proofId] = BalanceProof({
            a: _a,
            b: _b,
            c: _c,
            requiredAmount: _requiredAmount,
            publicHash: _publicHash,
            prover: msg.sender,
            timestamp: block.timestamp,
            verified: false
        });

        userProofs[msg.sender].push(proofId);
        emit ProofSubmitted(proofId, msg.sender, _requiredAmount, block.timestamp);

        _verifyProof(proofId);
        return proofId;
    }

    function verifyProof(bytes32 _proofId) external {
        _verifyProof(_proofId);
    }

    function _verifyProof(bytes32 _proofId) internal {
        BalanceProof storage proof = proofs[_proofId];
        require(proof.prover != address(0), "Proof does not exist");

        bool isValid = _simulateZkVerification(proof);
        proof.verified = isValid;
        emit ProofVerified(_proofId, msg.sender, isValid);
    }

    function _simulateZkVerification(BalanceProof memory proof) internal pure returns (bool) {
        return proof.publicHash > 0;
    }

    function getProof(bytes32 _proofId)
        external
        view
        returns (
            uint256 requiredAmount,
            uint256 publicHash,
            address prover,
            uint256 timestamp,
            bool verified
        )
    {
        BalanceProof memory proof = proofs[_proofId];
        return (
            proof.requiredAmount,
            proof.publicHash,
            proof.prover,
            proof.timestamp,
            proof.verified
        );
    }

    function getUserProofs(address _user) external view returns (bytes32[] memory) {
        return userProofs[_user];
    }

    function hasValidProof(address _user, uint256 _requiredAmount) external view returns (bool) {
        bytes32[] memory userProofIds = userProofs[_user];
        for (uint256 i = 0; i < userProofIds.length; i++) {
            BalanceProof memory proof = proofs[userProofIds[i]];
            if (proof.verified && proof.requiredAmount >= _requiredAmount) {
                if (block.timestamp - proof.timestamp < 86400) {
                    return true;
                }
            }
        }
        return false;
    }
}