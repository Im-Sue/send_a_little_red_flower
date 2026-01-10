# 送你一朵小红花 🌺

> 基于 Hyperbridge ISMP 协议的跨链慈善捐款平台
>
> 在 Ethereum 捐款，在 Arbitrum 收到小红花代币作为感谢

---

## 📖 项目简介

这是一个基于 Polkadot 生态 Hyperbridge 跨链协议的慈善捐款应用。用户在 Ethereum Sepolia 上发起捐款后，通过 Hyperbridge ISMP 协议将消息跨链传递到 Arbitrum Sepolia，并在目标链上铸造小红花 (FLOWER) 代币作为感谢凭证。

### 核心特性

- ✅ **跨链捐款**: Ethereum → Hyperbridge → Arbitrum 完整链路
- ✅ **感谢凭证**: 1 USDT 捐款 = 100 FLOWER 代币
- ✅ **去中心化**: 基于智能合约，无需中心化服务器
- ✅ **可验证性**: 所有捐款记录链上可查
- ✅ **安全可靠**: 经过完整的单元测试和实际跨链验证

---

## 🔄 工作原理

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Ethereum Sepolia (源链)                        │
│                                                                       │
│  用户                   TokenBridge                    ISMP Host     │
│   │                         │                              │         │
│   │  1. 授权 USDT          │                              │         │
│   ├────────────────────────>│                              │         │
│   │                         │                              │         │
│   │  2. 调用 donate()      │                              │         │
│   ├────────────────────────>│                              │         │
│   │                         │                              │         │
│   │                         │  3. 转入 100 USDT           │         │
│   │                         │<─────────────────            │         │
│   │                         │                              │         │
│   │                         │  4. dispatch(跨链消息)       │         │
│   │                         ├─────────────────────────────>│         │
│   │                         │  (支付 0.384 USD.h 费用)    │         │
│   │                         │                              │         │
└───┼─────────────────────────┼──────────────────────────────┼─────────┘
    │                         │                              │
    │                         │                              │
    │              ┌──────────▼──────────────────────────────▼────┐
    │              │                                               │
    │              │         Hyperbridge ISMP 协议                │
    │              │         (跨链消息中继)                        │
    │              │                                               │
    │              └──────────┬──────────────────────────────┬────┘
    │                         │                              │
    │                         │                              │
┌───┼─────────────────────────┼──────────────────────────────┼─────────┐
│   │                         │                              │         │
│  用户                 DonationVault                  ISMP Host       │
│   │                         │                              │         │
│   │                         │  5. onAccept(跨链消息)       │         │
│   │                         │<─────────────────────────────│         │
│   │                         │                              │         │
│   │                         │  6. 验证事件有效性           │         │
│   │                         │  7. 记录捐款数据             │         │
│   │                         │  8. 铸造 10,000 FLOWER       │         │
│   │                         │                              │         │
│   │  9. 收到 FLOWER         │                              │         │
│   │<────────────────────────│                              │         │
│   │                         │                              │         │
│                   Arbitrum Sepolia (目标链)                          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📍 合约地址清单

### 已部署的核心合约

| 合约 | 链 | 地址 | 功能 |
|------|-----|------|------|
| **DonationVault** | Arbitrum Sepolia | `0x1c6D6663B2667fE282680a8c36E05FA73ADB85f7` | 接收跨链消息，铸造 FLOWER |
| **TokenBridge** | Ethereum Sepolia | `0x5fB3B402CeB562AEd0BBC93a2dAE7ec87F9587A3` | 接收捐款，发送跨链消息 |
| **Mock USDT** | Ethereum Sepolia | `0xEabab8DA6dcfFC511579Cd1e43357B9A68842BD8` | 测试用的捐款代币 |

### Hyperbridge 基础设施地址

| 组件 | 链 | 地址 | 说明 |
|------|-----|------|------|
| **ISMP Host** | Ethereum Sepolia | `0x2EdB74C269948b60ec1000040E104cef0eABaae8` | Hyperbridge 协议核心 |
| **ISMP Host** | Arbitrum Sepolia | `0x3435bD7e5895356535459D6087D1eB982DAd90e7` | Hyperbridge 协议核心 |
| **FeeToken (USD.h)** | Ethereum Sepolia | `0xA801da100bF16D07F668F4A49E1f71fc54D05177` | 支付跨链费用的稳定币 |
| **TokenFaucet** | Ethereum Sepolia | `0x1794aB22388303ce9Cb798bE966eeEBeFe59C3a3` | 获取测试用 USD.h |

### 区块链浏览器链接

- **DonationVault**: https://sepolia.arbiscan.io/address/0x1c6D6663B2667fE282680a8c36E05FA73ADB85f7
- **TokenBridge**: https://sepolia.etherscan.io/address/0x5fB3B402CeB562AEd0BBC93a2dAE7ec87F9587A3
- **成功的跨链交易**: https://sepolia.etherscan.io/tx/0x652c834974d400ffd7178c5dbae0494fbd96594eab0c06d23ee389294da8f044

---

## 🏗️ 技术架构

### 合约结构

```
contracts/
├── src/
│   ├── TokenBridge.sol          # Ethereum 端：捐款入口合约
│   ├── DonationVault.sol        # Arbitrum 端：金库合约 + FLOWER 代币
│   └── interfaces/
│       └── IISMPCore.sol        # Hyperbridge ISMP 协议接口
├── script/
│   ├── DeployTokenBridge.s.sol  # TokenBridge 部署脚本
│   └── DeployDonationVault.s.sol # DonationVault 部署脚本
└── test/
    ├── TokenBridge.t.sol        # TokenBridge 单元测试
    ├── DonationVault.t.sol      # DonationVault 单元测试
    └── TokenBridge.feetoken.t.sol # feeToken 支付 Fork 测试
```

### 核心合约详解

#### 1. TokenBridge (Ethereum Sepolia)

**位置**: `src/TokenBridge.sol`

**功能**:
- 接收用户的 USDT 捐款
- 将捐款信息打包成跨链消息
- 调用 ISMP Host 发送消息到 Arbitrum
- 使用 USD.h (feeToken) 支付跨链费用

**关键方法**:
```solidity
// 发起捐款（使用默认事件 ID）
function donate(address token, uint256 amount) external;

// 发起捐款（指定事件 ID）
function donate(address token, uint256 amount, uint256 eventId) external;

// 给合约充值 USD.h（用于支付跨链费用）
function fundFeeToken(uint256 amount) external;

// 查询合约的 USD.h 余额
function getFeeTokenBalance() external view returns (uint256);
```

**构造参数**:
- `_ismpHost`: ISMP Host 合约地址 (`0x2EdB74C269948b60ec1000040E104cef0eABaae8`)
- `_donationVault`: 目标链金库地址 (`0x1c6D6663B2667fE282680a8c36E05FA73ADB85f7`)
- `_destChainId`: 目标链 ID (`StateMachine.evm(421614)` = Arbitrum Sepolia)
- `_defaultEventId`: 默认事件 ID (`1`)

#### 2. DonationVault (Arbitrum Sepolia)

**位置**: `src/DonationVault.sol`

**功能**:
- 继承 ERC20，实现 FLOWER 代币
- 实现 BaseIsmpModule，接收跨链消息
- 管理慈善事件
- 铸造小红花代币给捐赠者

**关键方法**:
```solidity
// 创建慈善事件（仅管理员）
function createEvent(
    string calldata title,
    string calldata description,
    uint256 targetAmount,
    uint256 deadline,
    address beneficiary
) external onlyOwner returns (uint256 eventId);

// 接收跨链消息（由 ISMP Host 调用）
function onAccept(IncomingPostRequest memory incoming) external override onlyHost;

// 查询事件信息
function getEvent(uint256 eventId) external view returns (DonationEvent memory);

// 查询事件的所有捐款记录
function getEventDonations(uint256 eventId) external view returns (Donation[] memory);

// 查询用户的 FLOWER 余额
function getDonorFlowers(address donor) external view returns (uint256);
```

**构造参数**:
- `_host`: ISMP Host 合约地址 (`0x3435bD7e5895356535459D6087D1eB982DAd90e7`)

**FLOWER 代币信息**:
- 名称: RedFlower
- 符号: FLOWER
- 精度: 18
- 铸造比例: 1 USDT = 100 FLOWER

---

## 🎯 使用流程

### 准备工作

1. **获取测试币**
   ```bash
   # 在 Ethereum Sepolia 水龙头获取 ETH
   # 在 Arbitrum Sepolia 水龙头获取 ETH
   ```

2. **获取 USD.h (feeToken)**
   ```bash
   cast send 0x1794aB22388303ce9Cb798bE966eeEBeFe59C3a3 \
     "drip(address)" \
     0xA801da100bF16D07F668F4A49E1f71fc54D05177 \
     --rpc-url https://sepolia.infura.io/v3/YOUR_KEY \
     --private-key YOUR_PRIVATE_KEY
   ```
   每次可获得 1000 USD.h

3. **获取 Mock USDT**
   ```bash
   # 调用 Mock USDT 的 mint 函数给自己铸造测试币
   cast send 0xEabab8DA6dcfFC511579Cd1e43357B9A68842BD8 \
     "mint(address,uint256)" \
     YOUR_ADDRESS \
     1000000000000000000000 \
     --rpc-url https://sepolia.infura.io/v3/YOUR_KEY \
     --private-key YOUR_PRIVATE_KEY
   ```

### 发起捐款

**Step 1: 给 TokenBridge 充值 USD.h**

TokenBridge 需要 USD.h 来支付跨链费用（每笔约 0.384 USD.h）。

```bash
cast send 0xA801da100bF16D07F668F4A49E1f71fc54D05177 \
  "transfer(address,uint256)" \
  0x5fB3B402CeB562AEd0BBC93a2dAE7ec87F9587A3 \
  500000000000000000000 \
  --rpc-url https://sepolia.infura.io/v3/YOUR_KEY \
  --private-key YOUR_PRIVATE_KEY
```

**Step 2: 授权 TokenBridge 使用你的 USDT**

```bash
cast send 0xEabab8DA6dcfFC511579Cd1e43357B9A68842BD8 \
  "approve(address,uint256)" \
  0x5fB3B402CeB562AEd0BBC93a2dAE7ec87F9587A3 \
  100000000000000000000 \
  --rpc-url https://sepolia.infura.io/v3/YOUR_KEY \
  --private-key YOUR_PRIVATE_KEY
```

**Step 3: 发起捐款**

```bash
cast send 0x5fB3B402CeB562AEd0BBC93a2dAE7ec87F9587A3 \
  "donate(address,uint256)" \
  0xEabab8DA6dcfFC511579Cd1e43357B9A68842BD8 \
  100000000000000000000 \
  --rpc-url https://sepolia.infura.io/v3/YOUR_KEY \
  --private-key YOUR_PRIVATE_KEY
```

**Step 4: 等待跨链完成（通常 2-5 分钟）**

Hyperbridge 的中继器会自动处理你的跨链消息。

**Step 5: 在 Arbitrum 查看你的 FLOWER**

```bash
cast call 0x1c6D6663B2667fE282680a8c36E05FA73ADB85f7 \
  "balanceOf(address)(uint256)" \
  YOUR_ADDRESS \
  --rpc-url https://arbitrum-sepolia.infura.io/v3/YOUR_KEY
```

---

## 🧪 测试结果

### 单元测试

```bash
forge test
```

**结果**: ✅ 39/39 通过

测试覆盖：
- TokenBridge 捐款流程
- DonationVault 事件管理
- FLOWER 代币铸造
- 跨链消息编解码
- 权限控制
- 边界情况

### Fork 测试

```bash
forge test --fork-url $SEPOLIA_RPC_URL \
  --match-contract TokenBridgeFeeTokenTest \
  -vvv
```

**结果**: ✅ 8/8 通过

测试覆盖：
- 从 TokenFaucet 获取 USD.h
- 给 TokenBridge 充值 USD.h
- 验证 approve 机制
- 完整的捐款流程（使用 feeToken）
- 费用估算
- 失败场景（余额不足）

### 实际跨链测试

**执行时间**: 2026-01-10

**测试数据**:
- **源链**: Ethereum Sepolia
- **目标链**: Arbitrum Sepolia
- **捐款金额**: 100 Mock USDT
- **跨链费用**: 0.384 USD.h
- **铸造代币**: 10,000 FLOWER
- **捐赠者**: `0xF344DC8d71f752D87Ef1c8662aF671973010249f`

**验证结果**:
- ✅ 代币成功转入 TokenBridge
- ✅ 跨链消息成功发送 (TX: `0x652c834...`)
- ✅ Hyperbridge 成功中继消息
- ✅ DonationVault 接收并处理消息
- ✅ FLOWER 代币准确铸造（1:100 比例）
- ✅ 捐款记录正确保存

**交易链接**:
- Ethereum 捐款交易: https://sepolia.etherscan.io/tx/0x652c834974d400ffd7178c5dbae0494fbd96594eab0c06d23ee389294da8f044

---

## 💰 费用说明

### 跨链费用构成

每笔跨链捐款需要支付：

1. **协议费用 (Protocol Fee)**
   - 支付方式: USD.h (feeToken)
   - 计算方式: 消息体大小 × 每字节费率
   - 实测费用: 约 0.384 USD.h
   - 支付者: TokenBridge 合约

2. **Gas 费用**
   - Ethereum Sepolia: ~0.0001545 ETH (发送交易)
   - Arbitrum Sepolia: ~0 ETH (由中继器支付)

### 费用示例

捐款 100 USDT 的总成本：

| 项目 | 金额 | 说明 |
|------|------|------|
| 捐款本金 | 100 USDT | 转入 TokenBridge |
| 跨链费用 | 0.384 USD.h | 从 TokenBridge 的 USD.h 余额扣除 |
| Gas 费 | ~0.0001545 ETH | 用户支付 Ethereum 交易 gas |
| **获得回报** | **10,000 FLOWER** | 在 Arbitrum 铸造 |

### USD.h 获取

测试网可通过 TokenFaucet 免费获取：

```bash
# 每次可获得 1000 USD.h，足够约 2600 笔交易
cast send 0x1794aB22388303ce9Cb798bE966eeEBeFe59C3a3 \
  "drip(address)" \
  0xA801da100bF16D07F668F4A49E1f71fc54D05177 \
  --rpc-url $SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY
```

---

## 🛠️ 开发指南

### 环境要求

- Foundry (forge, cast, anvil)
- Node.js >= 16
- Git

### 安装依赖

```bash
# 克隆仓库
git clone <your-repo-url>
cd contracts

# 安装依赖
forge install
```

### 配置环境

```bash
# 复制配置文件
cp .env.example .env

# 编辑 .env，填写你的配置
# PRIVATE_KEY=你的私钥
# SEPOLIA_RPC_URL=你的 Sepolia RPC
# ARBITRUM_SEPOLIA_RPC_URL=你的 Arbitrum Sepolia RPC
```

### 编译合约

```bash
forge build
```

### 运行测试

```bash
# 单元测试
forge test

# Fork 测试（需要 RPC）
forge test --fork-url $SEPOLIA_RPC_URL \
  --match-contract TokenBridgeFeeTokenTest \
  -vvv

# 查看 gas 报告
forge test --gas-report
```

### 部署合约

详见 `DEPLOYMENT.md` 文档。

---

## 📚 技术栈

- **智能合约**: Solidity ^0.8.20
- **开发框架**: Foundry
- **跨链协议**: Hyperbridge ISMP
- **标准库**: OpenZeppelin Contracts
  - ERC20: 代币标准
  - Ownable: 权限管理
  - ReentrancyGuard: 重入保护
- **测试工具**: Forge Test, Forge Fork

---

## 🔐 安全特性

### 合约安全

1. **重入保护**: 所有涉及代币转账的函数使用 `nonReentrant`
2. **权限控制**:
   - `onAccept` 仅允许 ISMP Host 调用
   - `createEvent` 仅允许 owner 调用
3. **输入验证**:
   - 金额必须 > 0
   - 地址不能为 0x0
   - 事件必须有效且未过期

### 已通过的测试

- ✅ 39 个单元测试全部通过
- ✅ 8 个 Fork 测试全部通过
- ✅ 实际跨链测试成功

### 已知限制

- 测试网环境仅支持 feeToken (USD.h) 支付
- 主网将支持原生 ETH 支付

---

## 📖 相关文档

- [部署文档 (DEPLOYMENT.md)](./DEPLOYMENT.md) - 详细的部署步骤和历史
- [Hyperbridge 官方文档](https://docs.hyperbridge.network/)
- [ISMP 协议规范](https://docs.hyperbridge.network/protocol/ismp)

---

## 🎯 项目状态

- ✅ **合约开发**: 完成
- ✅ **单元测试**: 39/39 通过
- ✅ **Fork 测试**: 8/8 通过
- ✅ **合约部署**: 已部署到测试网
- ✅ **跨链验证**: 已成功完成端到端测试
- ✅ **文档编写**: 完成

**当前版本**: v1.0.0 (2026-01-10)

**跨链功能**: ✅ 完全可用

---

## 📝 许可证

MIT License

---

## 👥 团队

- 开发者: 
- 项目类型: Polkadot Hackathon 2026

---

## 🙏 致谢

- Hyperbridge Team - 提供优秀的跨链协议
- OpenZeppelin - 提供安全的智能合约库
- Foundry - 提供高效的开发工具

