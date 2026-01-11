# 🌸 送你一朵小红花

[![Polkadot](https://img.shields.io/badge/Polkadot-E6007A?style=flat&logo=polkadot&logoColor=white)](https://polkadot.network/)
[![Hyperbridge](https://img.shields.io/badge/Hyperbridge-ISMP-blue)](https://hyperbridge.network/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **基于 Polkadot 生态的跨链慈善捐款平台**
>
> 在任意 EVM 链上捐款，在 Polkadot 上收到小红花代币作为感谢凭证
>
> *"让爱心跨越链的边界，让善款流向透明如水"*

[English](./README.md)

---

## 📖 项目简介

**送你一朵小红花** 是一个基于 **Polkadot 完整跨链技术栈** 的去中心化慈善捐款基础设施平台。我们为公益组织提供技术基础设施，让全球捐赠者可以跨越链的边界参与慈善。

### "小红花"的双重寓意

| 对象 | "你" 的含义 | "小红花" 的含义 |
|------|------------|----------------|
| **捐赠者** | 每一位献出爱心的你 | 🏆 精神褒奖 - 链上凭证和荣誉勋章 |
| **受助者** | 每一位需要帮助的你 | 💝 经济援助 - 来自社会的温暖支持 |

### 核心特性

- ✅ **完整跨链路径**: EVM → Hyperbridge → Polkadot SDK → XCM → 目标平行链
- ✅ **感谢凭证**: 1 USDT 捐款 = 100 FLOWER 代币 (SBT + Token 双轨制)
- ✅ **去中心化**: 基于智能合约，无需中心化服务器
- ✅ **透明可验证**: 所有捐款记录链上可查
- ✅ **隐私保护**: ZK 证明保护捐赠者与受助者隐私（规划中）
- ✅ **三层监管**: 智能合约 + 多签监管 + 社区验证（DAO）

### 平台定位

我们**不是**直接运营公益项目，而是提供**技术基础设施**：

- **平台（我们）**: 提供技术基础设施、智能合约、跨链能力
- **机构用户**: 公益组织、慈善机构、NGO 在平台发起项目
- **捐赠者**: 全球用户通过平台向项目捐款

> **一句话定位**: 我们是区块链世界的"腾讯公益"+"水滴筹"，但更透明、更去中心化、更全球化。

---

## 🔄 跨链架构

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              跨链消息流程                                    │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌─────────────┐
  │   EVM (A)   │  ← 用户发起捐款 (Ethereum, Arbitrum, BSC 等)
  │ TokenBridge │
  └──────┬──────┘
         │
         │  第一段: ISMP (加密证明 + 证据)
         ▼
  ┌─────────────────────────────────┐
  │         Hyperbridge             │  ← 跨链消息中继
  │      (ISMP 协议桥接)            │
  └──────────────┬──────────────────┘
                 │
                 │  ISMP 消息传递
                 ▼
  ┌─────────────────────────────────┐
  │      Polkadot SDK               │  ← Paseo / BridgeHub
  │     (中继链 / 桥接中心)          │
  └──────────────┬──────────────────┘
                 │
                 │  第二段: XCM (跨共识消息)
                 ▼
  ┌─────────────────────────────────┐
  │         目标平行链               │  ← Asset Hub / 自定义平行链
  │      (DonationVault)            │
  │      铸造 FLOWER 代币 🌺         │
  └─────────────────────────────────┘
```

### 为什么选择这个架构？

| 对比项 | 传统跨链桥 | Hyperbridge + XCM |
|--------|----------|-------------------|
| **安全模型** | 信任桥运营商（中心化） | 密码学证明（去信任） |
| **攻击面** | 桥合约漏洞/私钥泄露 | 需攻破共识层 |
| **消息类型** | 仅 Token 转移 | 任意跨链消息 |
| **生态覆盖** | 特定链对 | Polkadot 生态 + EVM 链 |

**优势**: 目前官方最稳妥的通路，不依赖外部桥接，XCM 部分完全可在目标链侧配置

---

## 📍 合约地址清单

### 已部署的核心合约

| 合约 | 链 | 地址 | 功能 |
|------|-----|------|------|
| **TokenBridge** | Ethereum Sepolia | `0x5fB3B402CeB562AEd0BBC93a2dAE7ec87F9587A3` | 接收捐款，发送跨链消息 |
| **DonationVault** | Arbitrum Sepolia | `0x1c6D6663B2667fE282680a8c36E05FA73ADB85f7` | 接收跨链消息，铸造 FLOWER |
| **Mock USDT** | Ethereum Sepolia | `0xEabab8DA6dcfFC511579Cd1e43357B9A68842BD8` | 测试用的捐款代币 |

### 基础设施地址

| 组件 | 链 | 地址 | 说明 |
|------|-----|------|------|
| **ISMP Host** | Ethereum Sepolia | `0x2EdB74C269948b60ec1000040E104cef0eABaae8` | Hyperbridge 协议核心 |
| **ISMP Host** | Arbitrum Sepolia | `0x3435bD7e5895356535459D6087D1eB982DAd90e7` | Hyperbridge 协议核心 |
| **FeeToken (USD.h)** | Ethereum Sepolia | `0xA801da100bF16D07F668F4A49E1f71fc54D05177` | 支付跨链费用的稳定币 |

---

## 🏗️ 项目结构

```
send_a_little_red_flower/
├── contracts/                    # Foundry 项目
│   ├── src/
│   │   ├── TokenBridge.sol       # EVM 端：捐款入口合约
│   │   ├── DonationVault.sol     # 目标链：金库合约 + FLOWER 代币 (ERC20)
│   │   └── interfaces/
│   │       └── IISMPCore.sol     # Hyperbridge ISMP 协议接口
│   ├── script/                   # 部署脚本
│   └── test/                     # 单元测试
├── frontend/                     # React + Vite + TypeScript
│   ├── src/
│   │   ├── pages/                # 页面组件（首页、事件、捐款）
│   │   ├── components/           # UI 组件（14 个组件）
│   │   ├── contracts/            # 合约 ABI 和地址
│   │   ├── services/             # API 服务
│   │   └── types/                # TypeScript 类型定义
│   └── package.json
├── other/
│   └── hackathon_presentation.html  # 黑客松演示文稿
├── README.md                     # 英文文档
└── README_CN.md                  # 中文文档
```

---

## 🚀 快速开始

### 环境要求

- [Foundry](https://book.getfoundry.sh/getting-started/installation) (forge, cast)
- Node.js >= 16
- Git

### 合约

```bash
cd contracts
forge install
forge build
forge test
```

### 前端

```bash
cd frontend
npm install
npm run dev
```

然后在浏览器中打开 http://localhost:5173

---

## 📚 技术栈

| 层级 | 技术选型 |
|------|----------|
| **智能合约** | Solidity ^0.8.20 |
| **开发框架** | Foundry |
| **跨链 (第一段)** | Hyperbridge ISMP |
| **跨链 (第二段)** | Polkadot XCM |
| **目标生态** | Polkadot (Asset Hub, Acala 等) |
| **前端框架** | React + Vite + TypeScript |
| **样式方案** | 原生 CSS + 自定义设计系统 |
| **标准库** | OpenZeppelin Contracts |
| **钱包连接** | MetaMask (Web3 Provider) |

---

## 🧪 测试结果

- ✅ **单元测试**: 39/39 通过
- ✅ **Fork 测试**: 8/8 通过
- ✅ **跨链验证**: 端到端测试成功

---

## 🗺️ 发展路线图

| 阶段 | 时间 | 目标 |
|------|------|------|
| **MVP** | 黑客松期间 | 跨链捐款演示 + FLOWER 代币铸造 |
| **V1.0** | +1 个月 | 多链支持 + 事件创建界面 |
| **V2.0** | +3 个月 | ZK 隐私保护 + 多签监管 |
| **V3.0** | +6 个月 | DAO 治理 + 生态合作 |

---

## 💡 为什么选择 Polkadot？

| 维度 | 为什么选择 Polkadot | 对慈善平台的价值 |
|------|-------------------|-----------------|
| **原生跨链架构** | XCM 是区块链级别的标准跨链协议 | 不是"桥接"而是"原生互操作"，更安全 |
| **共享安全性** | 所有平行链共享中继链的安全验证 | 无需担心单链安全性不足 |
| **异构多链** | 支持不同共识、不同 VM 的链 | 可同时支持 EVM 链和 Substrate 链 |
| **生态丰富** | 50+ 平行链，覆盖 DeFi、NFT、存储等 | 可与 Crust(存储)、Moonbeam(EVM) 等无缝协作 |
| **低成本** | 交易费用远低于以太坊主网 | 小额捐款也不会被 Gas 费"吃掉" |

---

## 🎯 项目状态

- ✅ 合约开发: 完成
- ✅ 合约部署: 已部署到测试网
- ✅ 跨链验证: 成功完成
- ✅ 前端开发: 完成
- 🔄 ZK 隐私: 规划中
- 🔄 DAO 治理: 规划中

**当前版本**: v1.0.0 (2026-01-10)

---

## 📝 许可证

MIT License

---

## 👥 团队

- **项目类型**: Polkadot Codecamp Hackathon 2026
- **赛道**: XCM + Hyperbridge

---

## 🙏 致谢

- **Hyperbridge Team** - ISMP 跨链协议
- **Polkadot/Acala Team** - XCM 消息基础设施
- **OpenZeppelin** - 安全的智能合约库
- **Web3 Foundation** - 生态支持

---

## 📞 联系我们

- **GitHub**: [Im-Sue/send_a_little_red_flower](https://github.com/Im-Sue/send_a_little_red_flower)

---

<div align="center">

🌸 **让爱心跨越链的边界** 🌸

</div>
