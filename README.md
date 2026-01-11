# Send a Little Red Flower 🌺

> Cross-chain charity donation platform built on Polkadot ecosystem
>
> Donate on EVM chains, receive FLOWER tokens on Acala as gratitude

[中文文档](./README_CN.md)

---

## 📖 Project Overview

This is a charity donation application leveraging the **full Polkadot cross-chain stack**. Users initiate donations on any EVM chain, and the donation message travels through Hyperbridge to Polkadot SDK, then via XCM to Acala parachain, where RedFlower (FLOWER) tokens are minted as gratitude credentials.

### Core Features

- ✅ **Full Cross-chain Path**: EVM → Hyperbridge → Polkadot SDK → XCM → Acala
- ✅ **Gratitude Token**: 1 USDT donation = 100 FLOWER tokens
- ✅ **Decentralized**: Smart contract-based, no centralized servers
- ✅ **Verifiable**: All donation records on-chain and queryable
- ✅ **Secure & Reliable**: Complete unit tests and cross-chain verification

---

## 🔄 Cross-chain Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CROSS-CHAIN FLOW                               │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌─────────────┐
  │   EVM (A)   │  ← User initiates donation (Ethereum, Arbitrum, etc.)
  │ TokenBridge │
  └──────┬──────┘
         │
         │  Stage 1: ISMP (proof + evidence)
         ▼
  ┌─────────────────────────────────┐
  │         Hyperbridge             │  ← Cross-chain message relay
  │    (ISMP Protocol Bridge)       │
  └──────────────┬──────────────────┘
                 │
                 │  Stage 1: ISMP delivery
                 ▼
  ┌─────────────────────────────────┐
  │      Polkadot SDK               │  ← Paseo / BridgeHub
  │   (Relay Chain / Bridge Hub)    │
  └──────────────┬──────────────────┘
                 │
                 │  Stage 2: XCM (Cross-Consensus Messaging)
                 ▼
  ┌─────────────────────────────────┐
  │           Acala                 │  ← Target Parachain
  │      (DonationVault)            │
  │    Mint FLOWER tokens 🌺        │
  └─────────────────────────────────┘
```

### Why This Architecture?

- **Stage 1 (Hyperbridge → Polkadot SDK)**: ISMP protocol provides cryptographic proofs and evidence for EVM → Polkadot bridging
- **Stage 2 (Polkadot SDK → Acala)**: Native XCM messaging within Polkadot ecosystem
- **Benefits**: Most stable official path, no external bridge dependencies, XCM fully configurable on Acala side

---

## 📍 Contract Addresses

### Deployed Core Contracts

| Contract | Chain | Address | Function |
|----------|-------|---------|----------|
| **DonationVault** | Arbitrum Sepolia | `0x1c6D6663B2667fE282680a8c36E05FA73ADB85f7` | Receive cross-chain messages, mint FLOWER |
| **TokenBridge** | Ethereum Sepolia | `0x5fB3B402CeB562AEd0BBC93a2dAE7ec87F9587A3` | Accept donations, send cross-chain messages |
| **Mock USDT** | Ethereum Sepolia | `0xEabab8DA6dcfFC511579Cd1e43357B9A68842BD8` | Test donation token |

### Infrastructure

| Component | Chain | Address | Description |
|-----------|-------|---------|-------------|
| **ISMP Host** | Ethereum Sepolia | `0x2EdB74C269948b60ec1000040E104cef0eABaae8` | Hyperbridge protocol core |
| **ISMP Host** | Arbitrum Sepolia | `0x3435bD7e5895356535459D6087D1eB982DAd90e7` | Hyperbridge protocol core |
| **FeeToken (USD.h)** | Ethereum Sepolia | `0xA801da100bF16D07F668F4A49E1f71fc54D05177` | Stablecoin for cross-chain fees |

---

## 🏗️ Project Structure

```
send_a_little_red_flower/
├── contracts/                    # Foundry project
│   ├── src/
│   │   ├── TokenBridge.sol       # EVM: Donation entry contract
│   │   ├── DonationVault.sol     # Target chain: Vault + FLOWER token
│   │   └── interfaces/
│   │       └── IISMPCore.sol     # Hyperbridge ISMP interface
│   ├── script/                   # Deployment scripts
│   └── test/                     # Unit tests
├── frontend/                     # React + Vite + TypeScript
│   ├── src/
│   │   ├── pages/                # Page components
│   │   ├── components/           # UI components
│   │   └── hooks/                # Custom hooks
│   └── package.json
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation) (forge, cast)
- Node.js >= 16
- Git

### Contracts

```bash
cd contracts
forge install
forge build
forge test
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📚 Tech Stack

| Layer | Technology |
|-------|------------|
| **Smart Contracts** | Solidity ^0.8.20 |
| **Development Framework** | Foundry |
| **Cross-chain (Stage 1)** | Hyperbridge ISMP |
| **Cross-chain (Stage 2)** | Polkadot XCM |
| **Target Parachain** | Acala |
| **Frontend** | React + Vite + TypeScript |
| **Standard Library** | OpenZeppelin Contracts |

---

## 🧪 Test Results

- ✅ **Unit Tests**: 39/39 passed
- ✅ **Fork Tests**: 8/8 passed
- ✅ **Cross-chain Verification**: End-to-end test successful

---

## 🎯 Project Status

- ✅ Contract Development: Complete
- ✅ Contract Deployment: Deployed to testnet
- ✅ Cross-chain Verification: Successful
- ✅ Frontend Development: Complete

**Current Version**: v1.0.0 (2026-01-10)

---

## 📝 License

MIT License

---

## 👥 Team

- Project Type: Polkadot Hackathon 2026

---

## 🙏 Acknowledgments

- Hyperbridge Team - ISMP cross-chain protocol
- Polkadot/Acala Team - XCM messaging infrastructure
- OpenZeppelin - Secure smart contract library
