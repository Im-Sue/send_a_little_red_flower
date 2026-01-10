# 前端对接文档

> 送你一朵小红花 - 前端集成指南
>
> 快速对接跨链慈善捐款平台

---

## 📋 目录

- [快速开始](#快速开始)
- [合约地址](#合约地址)
- [核心功能集成](#核心功能集成)
- [数据查询](#数据查询)
- [事件监听](#事件监听)
- [用户流程](#用户流程)
- [错误处理](#错误处理)
- [常见问题](#常见问题)

---

## 🚀 快速开始

### 推荐技术栈

- **Web3 库**: ethers.js v6 / viem / wagmi
- **钱包连接**: RainbowKit / WalletConnect
- **UI 框架**: React / Vue / Next.js

### 必需的 RPC 节点

```javascript
const chains = {
  ethereumSepolia: {
    chainId: 11155111,
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_KEY'
  },
  arbitrumSepolia: {
    chainId: 421614,
    rpcUrl: 'https://arbitrum-sepolia.infura.io/v3/YOUR_KEY'
  }
}
```

---

## 📍 合约地址

### 测试网部署

```javascript
// contracts/addresses.js
export const CONTRACTS = {
  // Ethereum Sepolia
  ethereum: {
    chainId: 11155111,
    tokenBridge: '0x5fB3B402CeB562AEd0BBC93a2dAE7ec87F9587A3',
    mockUSDT: '0xEabab8DA6dcfFC511579Cd1e43357B9A68842BD8',
    feeToken: '0xA801da100bF16D07F668F4A49E1f71fc54D05177', // USD.h
    tokenFaucet: '0x1794aB22388303ce9Cb798bE966eeEBeFe59C3a3'
  },

  // Arbitrum Sepolia
  arbitrum: {
    chainId: 421614,
    donationVault: '0x1c6D6663B2667fE282680a8c36E05FA73ADB85f7'
  }
}
```

### 合约 ABI

完整的 ABI 文件位于 `contracts/out/` 目录：
- `TokenBridge.sol/TokenBridge.json`
- `DonationVault.sol/DonationVault.json`
- `MockERC20.sol/MockERC20.json`

---

## 🔧 核心功能集成

### 1. 发起捐款

**用户需要做的事情**:
1. 授权 TokenBridge 使用 USDT
2. 调用 donate 函数

**前端实现步骤**:

#### Step 1: 检查余额

```javascript
// 检查用户的 USDT 余额
async function checkBalance(userAddress, tokenAddress) {
  const balance = await tokenContract.balanceOf(userAddress)
  return balance // 返回 BigInt
}
```

#### Step 2: 授权代币

```javascript
// 授权 TokenBridge 使用用户的 USDT
async function approveToken(tokenAddress, bridgeAddress, amount) {
  const tx = await tokenContract.approve(bridgeAddress, amount)
  await tx.wait()
  return tx.hash
}
```

#### Step 3: 发起捐款

```javascript
// 调用 donate 函数（使用默认事件 ID）
async function donate(tokenAddress, amount) {
  const tx = await tokenBridgeContract.donate(tokenAddress, amount)
  await tx.wait()
  return tx.hash
}

// 或指定事件 ID
async function donateToEvent(tokenAddress, amount, eventId) {
  const tx = await tokenBridgeContract.donate(tokenAddress, amount, eventId)
  await tx.wait()
  return tx.hash
}
```

**简化的完整流程**:

```javascript
async function handleDonation(amount) {
  try {
    // 1. 检查余额
    const balance = await checkBalance(userAddress, USDT_ADDRESS)
    if (balance < amount) {
      throw new Error('余额不足')
    }

    // 2. 授权
    await approveToken(USDT_ADDRESS, BRIDGE_ADDRESS, amount)

    // 3. 捐款
    const txHash = await donate(USDT_ADDRESS, amount)

    // 4. 显示成功提示
    showSuccess(`捐款成功！交易哈希: ${txHash}`)

  } catch (error) {
    showError(error.message)
  }
}
```

---

### 2. 查询 FLOWER 余额

在 Arbitrum Sepolia 上查询用户获得的小红花代币。

```javascript
// 查询用户的 FLOWER 余额
async function getFlowerBalance(userAddress) {
  const balance = await donationVaultContract.balanceOf(userAddress)
  return balance // 1 USDT = 100 FLOWER
}

// 格式化显示
function formatFlowerBalance(balance) {
  return (Number(balance) / 1e18).toLocaleString()
}
```

---

### 3. 查询捐款事件

```javascript
// 获取事件详情
async function getEventInfo(eventId) {
  const event = await donationVaultContract.getEvent(eventId)
  return {
    title: event.title,
    description: event.description,
    targetAmount: event.targetAmount,
    currentAmount: event.currentAmount,
    deadline: event.deadline,
    beneficiary: event.beneficiary,
    isActive: event.isActive
  }
}
```

---

### 4. 查询捐款记录

```javascript
// 获取某个事件的所有捐款记录
async function getDonations(eventId) {
  const donations = await donationVaultContract.getEventDonations(eventId)

  return donations.map(d => ({
    donor: d.donor,
    amount: d.amount,
    timestamp: d.timestamp,
    flowersReceived: d.flowersReceived
  }))
}
```

---

## 📊 数据查询

### 查询 TokenBridge 状态

```javascript
// 查询 TokenBridge 的 USD.h 余额（用于支付跨链费用）
async function getBridgeFeeBalance() {
  const balance = await tokenBridgeContract.getFeeTokenBalance()
  return balance
}

// 检查 TokenBridge 是否有足够的 USD.h
async function checkBridgeCanOperate() {
  const balance = await getBridgeFeeBalance()
  const minRequired = ethers.parseEther('0.5') // 至少 0.5 USD.h
  return balance >= minRequired
}
```

### 查询用户总捐款

```javascript
// 查询用户在某个事件的总捐款金额
async function getUserTotalDonation(userAddress) {
  const total = await donationVaultContract.donorTotalAmount(userAddress)
  return total
}
```

---

## 📡 事件监听

### 监听捐款发起事件

在 **Ethereum Sepolia** 上监听 `DonationInitiated` 事件：

```javascript
// 监听捐款发起
tokenBridgeContract.on('DonationInitiated',
  (donor, amount, eventId, messageId) => {
    console.log('捐款已发起:', {
      donor,
      amount: amount.toString(),
      eventId: eventId.toString(),
      messageId
    })

    // 更新 UI，显示跨链进行中
    updateDonationStatus('pending', messageId)
  }
)
```

### 监听捐款到账事件

在 **Arbitrum Sepolia** 上监听 `DonationReceived` 事件：

```javascript
// 监听捐款到账
donationVaultContract.on('DonationReceived',
  (eventId, donor, amount, flowers) => {
    console.log('捐款已到账:', {
      eventId: eventId.toString(),
      donor,
      amount: amount.toString(),
      flowers: flowers.toString()
    })

    // 更新 UI，显示捐款成功
    updateDonationStatus('success', {
      amount,
      flowers
    })
  }
)
```

---

## 👤 用户流程

### 完整的捐款体验流程

```
1. 用户访问页面
   ↓
2. 连接钱包（MetaMask / WalletConnect）
   ↓
3. 切换到 Ethereum Sepolia 网络
   ↓
4. 选择捐款金额（如 100 USDT）
   ↓
5. 点击"捐款"按钮
   ↓
6. 第一笔交易：授权 USDT
   - 显示授权确认弹窗
   - 等待交易确认
   ↓
7. 第二笔交易：发起捐款
   - 显示捐款确认弹窗
   - 等待交易确认
   ↓
8. 显示"跨链中"状态
   - 预计 2-5 分钟
   - 可以查看交易哈希
   ↓
9. 切换到 Arbitrum Sepolia 网络
   ↓
10. 查看获得的 FLOWER 代币
    - 100 USDT → 10,000 FLOWER
    ↓
11. 显示捐款完成页面
    - 感谢信息
    - 小红花数量
    - 捐款记录
```

---

## 🎨 UI 交互建议

### 捐款页面核心元素

```
┌─────────────────────────────────────────┐
│  选择捐款金额                             │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────────┐   │
│  │ 10  │ │ 50  │ │ 100 │ │ 自定义  │   │
│  └─────┘ └─────┘ └─────┘ └─────────┘   │
│                                         │
│  你将获得: 10,000 FLOWER 🌺             │
│                                         │
│  当前余额: 1,000 USDT                   │
│                                         │
│  [  立即捐款  ]                         │
└─────────────────────────────────────────┘
```

### 状态提示

1. **授权中**: "正在授权 USDT..."
2. **捐款中**: "正在发起捐款..."
3. **跨链中**: "消息跨链传递中，预计 2-5 分钟..."
4. **完成**: "捐款成功！你获得了 10,000 朵小红花 🌺"

### 进度指示器

```
Ethereum Sepolia          Hyperbridge          Arbitrum Sepolia
      ✅                      ⏳                      ⏹
   捐款已发起              跨链中                 等待接收
```

---

## ⚠️ 错误处理

### 常见错误及处理

```javascript
function handleError(error) {
  const errorMessages = {
    // 用户拒绝
    'user rejected': '用户取消了交易',

    // 余额不足
    'insufficient funds': 'ETH 余额不足，请充值 gas 费',
    'Amount must be positive': '捐款金额必须大于 0',

    // 授权问题
    'ERC20: insufficient allowance': '请先授权 USDT',

    // 网络问题
    'network error': '网络连接失败，请重试',

    // 合约问题
    'Event not active': '该捐款事件已结束',
    'Event ended': '捐款已截止',
  }

  for (let [key, message] of Object.entries(errorMessages)) {
    if (error.message.includes(key)) {
      return message
    }
  }

  return '操作失败，请重试'
}
```

---

## 💡 最佳实践

### 1. 网络切换提示

```javascript
async function ensureCorrectNetwork(requiredChainId) {
  const currentChainId = await signer.getChainId()

  if (currentChainId !== requiredChainId) {
    // 提示用户切换网络
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${requiredChainId.toString(16)}` }]
    })
  }
}
```

### 2. 交易状态跟踪

```javascript
async function trackTransaction(txHash, chainId) {
  // 显示交易进行中
  updateUI('pending', txHash)

  // 等待确认
  const receipt = await provider.waitForTransaction(txHash)

  if (receipt.status === 1) {
    updateUI('success', receipt)
  } else {
    updateUI('failed', receipt)
  }

  return receipt
}
```

### 3. 金额输入验证

```javascript
function validateDonationAmount(amount, balance) {
  const amountBN = ethers.parseEther(amount.toString())

  if (amountBN <= 0n) {
    return '金额必须大于 0'
  }

  if (amountBN > balance) {
    return '余额不足'
  }

  return null // 验证通过
}
```

---

## 🔍 跨链状态查询

### 查询跨链消息状态（可选）

由于 Hyperbridge 会自动处理消息中继，前端可以：

**方案 1**: 轮询查询
```javascript
async function pollForFlowers(userAddress, expectedAmount) {
  const maxAttempts = 60 // 最多查询 5 分钟
  let attempts = 0

  const interval = setInterval(async () => {
    attempts++

    const balance = await getFlowerBalance(userAddress)

    if (balance >= expectedAmount) {
      clearInterval(interval)
      onCrossChainComplete(balance)
    }

    if (attempts >= maxAttempts) {
      clearInterval(interval)
      onTimeout()
    }
  }, 5000) // 每 5 秒查询一次
}
```

**方案 2**: 事件监听（推荐）
```javascript
// 直接监听 DonationReceived 事件
donationVaultContract.once('DonationReceived',
  (eventId, donor, amount, flowers, event) => {
    if (donor.toLowerCase() === userAddress.toLowerCase()) {
      onCrossChainComplete({
        amount,
        flowers,
        txHash: event.transactionHash
      })
    }
  }
)
```

---

## 📱 移动端适配

### 推荐钱包

- MetaMask Mobile
- WalletConnect
- Rainbow Wallet
- Trust Wallet

### 移动端注意事项

1. **网络切换**: 移动钱包可能需要手动切换网络
2. **Gas 估算**: 移动端显示预估 gas 费用
3. **交易确认**: 提供清晰的交易摘要

---

## 🎯 示例数据

### 用于测试的数据

```javascript
// 示例事件 ID
const EXAMPLE_EVENT_ID = 1

// 示例捐款金额（单位：wei）
const DONATION_AMOUNTS = {
  small: ethers.parseEther('10'),   // 10 USDT → 1,000 FLOWER
  medium: ethers.parseEther('50'),  // 50 USDT → 5,000 FLOWER
  large: ethers.parseEther('100'),  // 100 USDT → 10,000 FLOWER
}

// 示例用户地址（测试）
const TEST_DONOR = '0xF344DC8d71f752D87Ef1c8662aF671973010249f'
```

---

## ❓ 常见问题

### Q1: 跨链需要多久？

**A**: 通常 2-5 分钟，Hyperbridge 自动处理中继。

### Q2: 用户需要支付跨链费用吗？

**A**: 不需要。跨链费用（约 0.384 USD.h）由 TokenBridge 合约支付。用户只需支付 Ethereum 的 gas 费。

### Q3: 如何计算用户获得的 FLOWER？

**A**: 固定比例 `1 USDT = 100 FLOWER`
```javascript
const flowers = donationAmount * 100n
```

### Q4: 如果跨链失败怎么办？

**A**:
- USDT 已转入 TokenBridge，不会丢失
- Hyperbridge 有超时重试机制
- 超时时间为 1 小时，超时后可查询消息状态

### Q5: 可以取消已发起的捐款吗？

**A**: 不可以。一旦调用 `donate()` 且交易确认，USDT 已转入合约，无法撤回。

### Q6: 支持哪些代币？

**A**:
- 测试网：Mock USDT (`0xEabab8DA6dcfFC511579Cd1e43357B9A68842BD8`)
- 生产环境：可配置任意 ERC20 代币

---

## 📚 参考资源

### 官方文档

- [Hyperbridge 文档](https://docs.hyperbridge.network/)
- [ISMP 协议](https://docs.hyperbridge.network/protocol/ismp)
- [ethers.js 文档](https://docs.ethers.org/v6/)

### 合约源码

- 完整代码：`/contracts/src/`
- ABI 文件：`/contracts/out/`
- 测试用例：`/contracts/test/`

### 区块链浏览器

- Ethereum Sepolia: https://sepolia.etherscan.io/
- Arbitrum Sepolia: https://sepolia.arbiscan.io/

---

## 🛠️ 开发工具推荐

- **Hardhat Console**: 本地测试合约调用
- **Tenderly**: 交易模拟和调试
- **Etherscan**: 查看合约代码和交易
- **Rainbow**: 测试钱包集成

---

**文档版本**: v1.0.0
**最后更新**: 2026-01-10
**维护者**: 送你一朵小红花团队
