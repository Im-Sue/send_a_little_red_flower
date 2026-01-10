# 合约 ABI 文件

这个目录包含前端集成所需的合约 ABI（Application Binary Interface）文件。

## 文件说明

### TokenBridge.json
- **合约地址 (Ethereum Sepolia)**: `0x5fB3B402CeB562AEd0BBC93a2dAE7ec87F9587A3`
- **功能**: 在 Ethereum 发起捐款，发送跨链消息
- **主要方法**:
  - `donate(address token, uint256 amount)` - 发起捐款（使用默认事件 ID）
  - `donate(address token, uint256 amount, uint256 eventId)` - 发起捐款（指定事件 ID）
  - `fundFeeToken(uint256 amount)` - 充值 USD.h（跨链费用）
  - `getFeeTokenBalance()` - 查询 USD.h 余额
  - `updateDefaultEventId(uint256 newEventId)` - 更新默认事件 ID

### DonationVault.json
- **合约地址 (Arbitrum Sepolia)**: `0x1c6D6663B2667fE282680a8c36E05FA73ADB85f7`
- **功能**: 接收跨链捐款，铸造 FLOWER 代币
- **主要方法**:
  - `balanceOf(address account)` - 查询 FLOWER 余额
  - `getEvent(uint256 eventId)` - 查询事件信息
  - `getEventDonations(uint256 eventId)` - 查询事件的所有捐款记录
  - `getDonorFlowers(address donor)` - 查询捐赠者的 FLOWER 余额
  - `donorTotalAmount(address donor)` - 查询捐赠者的总捐款金额
  - `createEvent(...)` - 创建慈善事件（仅管理员）

### ERC20.json
- **用途**: 标准 ERC20 代币接口
- **使用场景**:
  - 操作 Mock USDT (`0xEabab8DA6dcfFC511579Cd1e43357B9A68842BD8`)
  - 操作 USD.h (`0xA801da100bF16D07F668F4A49E1f71fc54D05177`)
  - 任意 ERC20 代币
- **主要方法**:
  - `balanceOf(address account)` - 查询余额
  - `approve(address spender, uint256 amount)` - 授权
  - `transfer(address to, uint256 amount)` - 转账
  - `allowance(address owner, address spender)` - 查询授权额度

## 使用示例

### JavaScript (ethers.js)

```javascript
import TokenBridgeABI from './abis/TokenBridge.json'
import DonationVaultABI from './abis/DonationVault.json'
import ERC20ABI from './abis/ERC20.json'

// 创建合约实例
const tokenBridge = new ethers.Contract(
  '0x5fB3B402CeB562AEd0BBC93a2dAE7ec87F9587A3',
  TokenBridgeABI,
  signer
)

const donationVault = new ethers.Contract(
  '0x1c6D6663B2667fE282680a8c36E05FA73ADB85f7',
  DonationVaultABI,
  provider
)

const usdt = new ethers.Contract(
  '0xEabab8DA6dcfFC511579Cd1e43357B9A68842BD8',
  ERC20ABI,
  signer
)
```

### TypeScript

```typescript
import TokenBridgeABI from './abis/TokenBridge.json'
import type { TokenBridge } from './types' // 使用 typechain 生成的类型

const tokenBridge = new ethers.Contract(
  '0x5fB3B402CeB562AEd0BBC93a2dAE7ec87F9587A3',
  TokenBridgeABI,
  signer
) as TokenBridge
```

## 测试网配置

### Ethereum Sepolia
- **Chain ID**: 11155111
- **RPC**: `https://sepolia.infura.io/v3/YOUR_KEY`
- **TokenBridge**: `0x5fB3B402CeB562AEd0BBC93a2dAE7ec87F9587A3`
- **Mock USDT**: `0xEabab8DA6dcfFC511579Cd1e43357B9A68842BD8`

### Arbitrum Sepolia
- **Chain ID**: 421614
- **RPC**: `https://arbitrum-sepolia.infura.io/v3/YOUR_KEY`
- **DonationVault**: `0x1c6D6663B2667fE282680a8c36E05FA73ADB85f7`

## 更新说明

这些 ABI 文件从 Foundry 编译输出自动提取：

```bash
# 重新生成 ABI（开发者使用）
forge build
jq '.abi' out/TokenBridge.sol/TokenBridge.json > abis/TokenBridge.json
jq '.abi' out/DonationVault.sol/DonationVault.json > abis/DonationVault.json
jq '.abi' out/ERC20.sol/ERC20.json > abis/ERC20.json
```

## 相关文档

- [前端对接文档](../../docs/FRONTEND_INTEGRATION.md)
- [项目 README](../README.md)

---

**最后更新**: 2026-01-10
**合约版本**: v1.0.0
