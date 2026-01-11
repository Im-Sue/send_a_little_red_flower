# 🌸 Send a Little Red Flower

[![Polkadot](https://img.shields.io/badge/Polkadot-E6007A?style=flat&logo=polkadot&logoColor=white)](https://polkadot.network/)
[![Hyperbridge](https://img.shields.io/badge/Hyperbridge-ISMP-blue)](https://hyperbridge.network/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Cross-chain charity donation platform built on Polkadot ecosystem**
>
> Donate on any EVM chain, receive FLOWER tokens on Polkadot as gratitude credentials
>
> *"Let love cross the boundaries of chains, let kindness flow as transparently as water"*

[中文文档](./README_CN.md)

---

## 📖 Project Overview

**Send a Little Red Flower** is a decentralized charity donation infrastructure platform built on the **complete Polkadot cross-chain technology stack**. We provide technical infrastructure for public welfare organizations, allowing global donors to participate in charity across chain boundaries.

### What Does "Little Red Flower" Mean?

| Recipient | "You" Refers To | "Little Red Flower" Meaning |
|-----------|-----------------|----------------------------|
| **Donors** | Every loving heart | 🏆 Spiritual recognition - On-chain credentials and honor badges |
| **Beneficiaries** | Everyone needing help | 💝 Economic assistance - Warmth and support from society |

### Core Features

- ✅ **Full Cross-chain Path**: EVM → Hyperbridge → Polkadot SDK → XCM → Target Parachain
- ✅ **Gratitude Tokens**: 1 USDT donation = 100 FLOWER tokens (SBT + Token hybrid)
- ✅ **Decentralized**: Smart contract-based, no centralized servers
- ✅ **Transparent & Verifiable**: All donation records on-chain and queryable
- ✅ **Privacy Protection**: ZK proofs protect donor and beneficiary privacy (planned)
- ✅ **Multi-layer Supervision**: Smart contracts + Multi-sig supervision + Community verification (DAO)

### Platform Positioning

We are **not** directly operating charity projects - we provide **technical infrastructure**:

- **Platform (Us)**: Technical infrastructure, smart contracts, cross-chain capabilities
- **Institutional Users**: Public welfare organizations, charities, NGOs launch projects on the platform
- **Donors**: Global users donate to projects through the platform

> **One-line positioning**: We are the "Tencent Charity" + "GoFundMe" of blockchain, but more transparent, decentralized, and global.

---

## 🔄 Cross-chain Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CROSS-CHAIN FLOW                               │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌─────────────┐
  │   EVM (A)   │  ← User initiates donation (Ethereum, Arbitrum, BSC, etc.)
  │ TokenBridge │
  └──────┬──────┘
         │
         │  Stage 1: ISMP (cryptographic proof + evidence)
         ▼
  ┌─────────────────────────────────┐
  │         Hyperbridge             │  ← Cross-chain message relay
  │    (ISMP Protocol Bridge)       │
  └──────────────┬──────────────────┘
                 │
                 │  ISMP message delivery
                 ▼
  ┌─────────────────────────────────┐
  │      Polkadot SDK               │  ← Paseo / BridgeHub
  │   (Relay Chain / Bridge Hub)    │
  └──────────────┬──────────────────┘
                 │
                 │  Stage 2: XCM (Cross-Consensus Messaging)
                 ▼
  ┌─────────────────────────────────┐
  │      Target Parachain           │  ← Asset Hub / Custom Parachain
  │      (DonationVault)            │
  │    Mint FLOWER tokens 🌺        │
  └─────────────────────────────────┘
```

### Why This Architecture?

| Comparison | Traditional Cross-chain Bridges | Hyperbridge + XCM |
|------------|--------------------------------|-------------------|
| **Security Model** | Trust bridge operators (centralized) | Cryptographic proofs (trustless) |
| **Attack Surface** | Bridge contract vulnerabilities / private key leaks | Need to break consensus layer |
| **Message Types** | Token transfers only | Arbitrary cross-chain messages |
| **Ecosystem Coverage** | Specific chain pairs | Polkadot ecosystem + EVM chains |

**Benefits**: Most stable official path, no external bridge dependencies, XCM fully configurable on target chain

---

## 📍 Contract Addresses

### Deployed Core Contracts

| Contract | Chain | Address | Function |
|----------|-------|---------|----------|
| **TokenBridge** | Ethereum Sepolia | `0x5fB3B402CeB562AEd0BBC93a2dAE7ec87F9587A3` | Accept donations, send cross-chain messages |
| **DonationVault** | Arbitrum Sepolia | `0x1c6D6663B2667fE282680a8c36E05FA73ADB85f7` | Receive cross-chain messages, mint FLOWER |
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
│   │   ├── DonationVault.sol     # Target chain: Vault + FLOWER token (ERC20)
│   │   └── interfaces/
│   │       └── IISMPCore.sol     # Hyperbridge ISMP interface
│   ├── script/                   # Deployment scripts
│   └── test/                     # Unit tests
├── frontend/                     # React + Vite + TypeScript
│   ├── src/
│   │   ├── pages/                # Page components (Home, Events, Donations)
│   │   ├── components/           # UI components (14 components)
│   │   ├── contracts/            # Contract ABIs and addresses
│   │   ├── services/             # API services
│   │   └── types/                # TypeScript type definitions
│   └── package.json
├── other/
│   └── hackathon_presentation.html  # Hackathon demo presentation
├── README.md                     # English documentation
└── README_CN.md                  # Chinese documentation
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

Then open http://localhost:5173 in your browser.

---

## 📚 Tech Stack

| Layer | Technology |
|-------|------------|
| **Smart Contracts** | Solidity ^0.8.20 |
| **Development Framework** | Foundry |
| **Cross-chain (Stage 1)** | Hyperbridge ISMP |
| **Cross-chain (Stage 2)** | Polkadot XCM |
| **Target Ecosystem** | Polkadot (Asset Hub, Acala, etc.) |
| **Frontend** | React + Vite + TypeScript |
| **Styling** | Vanilla CSS with custom design system |
| **Standard Library** | OpenZeppelin Contracts |
| **Wallet Connection** | MetaMask (Web3 Provider) |

---

## 🧪 Test Results

- ✅ **Unit Tests**: 39/39 passed
- ✅ **Fork Tests**: 8/8 passed
- ✅ **Cross-chain Verification**: End-to-end test successful

---

## 🗺️ Roadmap

| Phase | Timeline | Goals |
|-------|----------|-------|
| **MVP** | Hackathon | Cross-chain donation demo + FLOWER token minting |
| **V1.0** | +1 month | Multi-chain support + Event creation interface |
| **V2.0** | +3 months | ZK privacy protection + Multi-sig supervision |
| **V3.0** | +6 months | DAO governance + Ecosystem partnerships |

---

## 💡 Why Polkadot?

| Dimension | Why Polkadot | Value for Charity Platform |
|-----------|-------------|---------------------------|
| **Native Cross-chain** | XCM is a blockchain-level standard protocol | "Native interoperability" not "bridging", more secure |
| **Shared Security** | All parachains share relay chain security | No worries about single-chain security |
| **Heterogeneous Multi-chain** | Supports chains with different consensus and VMs | Can support both EVM and Substrate chains |
| **Rich Ecosystem** | 50+ parachains covering DeFi, NFT, storage | Seamless collaboration with Crust (storage), Moonbeam (EVM) |
| **Low Cost** | Transaction fees far lower than Ethereum mainnet | Small donations won't be "eaten" by gas fees |

---

## 🎯 Project Status

- ✅ Contract Development: Complete
- ✅ Contract Deployment: Deployed to testnet
- ✅ Cross-chain Verification: Successful
- ✅ Frontend Development: Complete
- 🔄 ZK Privacy: Planned
- 🔄 DAO Governance: Planned

**Current Version**: v1.0.0 (2026-01-10)

---

## 📝 License

MIT License

---

## 👥 Team

- **Project Type**: Polkadot Codecamp Hackathon 2026
- **Challenge Track**: XCM + Hyperbridge

---

## 🙏 Acknowledgments

- **Hyperbridge Team** - ISMP cross-chain protocol
- **Polkadot/Acala Team** - XCM messaging infrastructure
- **OpenZeppelin** - Secure smart contract library
- **Web3 Foundation** - Ecosystem support

---

## 📞 Contact

- **GitHub**: [Im-Sue/send_a_little_red_flower](https://github.com/Im-Sue/send_a_little_red_flower)

---

<div align="center">

🌸 **Let love cross the boundaries of chains** 🌸

</div>
