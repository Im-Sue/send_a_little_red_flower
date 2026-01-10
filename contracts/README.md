# 送你一朵小红花 - 跨链慈善捐款平台

基于 Hyperbridge ISMP 协议的跨链捐款平台，用户在 Ethereum 捐款后，可在 Arbitrum 收到小红花代币作为感谢。

## 功能

- 在 Ethereum Sepolia 发起捐款
- 通过 Hyperbridge ISMP 跨链传递消息
- 在 Arbitrum Sepolia 接收捐款并铸造小红花代币
- 1 USDT = 100 FLOWER 的固定比例

## 已部署合约

### Arbitrum Sepolia
- **DonationVault**: `0x1c6D6663B2667fE282680a8c36E05FA73ADB85f7`
  - 接收跨链捐款
  - 铸造小红花代币 (FLOWER)
  - 管理捐款事件

### Ethereum Sepolia
- **TokenBridge**: `0x1c6D6663B2667fE282680a8c36E05FA73ADB85f7`
  - 接收用户捐款
  - 发送跨链消息

### 测试代币
- **Mock USDT**: `0xEabab8DA6dcfFC511579Cd1e43357B9A68842BD8` (Ethereum Sepolia)

## 技术栈

- Solidity ^0.8.20
- Foundry (开发框架)
- Hyperbridge ISMP (跨链协议)
- OpenZeppelin (ERC20, Ownable, ReentrancyGuard)

## 测试

- 单元测试: 39/39 通过
- Fork 测试: 通过
- 实际部署测试: DonationVault 功能验证通过

## 当前状态

- ✅ 合约部署完成
- ✅ DonationVault 核心功能正常
- ✅ 小红花代币铸造正常
- ⚠️ 跨链调用需要使用 feeToken (USD.h) 支付（测试网限制）

## 快速开始

### 环境配置

```bash
# 复制配置文件
cp .env.example .env

# 编辑 .env 填写你的私钥和 RPC URLs
```

### 编译

```bash
forge build
```

### 测试

```bash
forge test
```

### 部署

详见 `DEPLOYMENT.md`

## 区块链浏览器

- Arbitrum Sepolia: https://sepolia.arbiscan.io/address/0x1c6D6663B2667fE282680a8c36E05FA73ADB85f7
- Ethereum Sepolia: https://sepolia.etherscan.io/address/0x1c6D6663B2667fE282680a8c36E05FA73ADB85f7

## 合约结构

```
src/
├── TokenBridge.sol       # Ethereum 端捐款入口
├── DonationVault.sol     # Arbitrum 端捐款接收
└── interfaces/
    └── IISMPCore.sol     # ISMP 协议接口
```

## 说明

- 当前实现使用 Ethereum Sepolia 和 Arbitrum Sepolia 测试网
- 跨链通过 Hyperbridge ISMP 协议实现
- 测试网环境仅支持 feeToken (USD.h) 支付费用
