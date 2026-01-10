/**
 * 合约地址配置
 *
 * 用于前端集成的合约地址常量
 * 最后更新: 2026-01-10
 */

// Ethereum Sepolia (Chain ID: 11155111)
export const ETHEREUM_SEPOLIA = {
  chainId: 11155111,
  name: 'Ethereum Sepolia',
  rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',

  contracts: {
    // 核心合约
    tokenBridge: '0x5fB3B402CeB562AEd0BBC93a2dAE7ec87F9587A3',

    // 测试代币
    mockUSDT: '0xEabab8DA6dcfFC511579Cd1e43357B9A68842BD8',

    // Hyperbridge 基础设施
    feeToken: '0xA801da100bF16D07F668F4A49E1f71fc54D05177', // USD.h
    tokenFaucet: '0x1794aB22388303ce9Cb798bE966eeEBeFe59C3a3',
    ismpHost: '0x2EdB74C269948b60ec1000040E104cef0eABaae8'
  },

  // 区块链浏览器
  explorer: 'https://sepolia.etherscan.io'
}

// Arbitrum Sepolia (Chain ID: 421614)
export const ARBITRUM_SEPOLIA = {
  chainId: 421614,
  name: 'Arbitrum Sepolia',
  rpcUrl: 'https://arbitrum-sepolia.infura.io/v3/YOUR_INFURA_KEY',

  contracts: {
    // 核心合约
    donationVault: '0x1c6D6663B2667fE282680a8c36E05FA73ADB85f7',

    // Hyperbridge 基础设施
    ismpHost: '0x3435bD7e5895356535459D6087D1eB982DAd90e7'
  },

  // 区块链浏览器
  explorer: 'https://sepolia.arbiscan.io'
}

// 默认事件 ID
export const DEFAULT_EVENT_ID = 1

// FLOWER 代币兑换比例
export const FLOWER_RATIO = 100 // 1 USDT = 100 FLOWER

// 跨链费用（参考值）
export const CROSS_CHAIN_FEE = '0.384' // USD.h per transaction

// 所有支持的网络
export const SUPPORTED_CHAINS = {
  [ETHEREUM_SEPOLIA.chainId]: ETHEREUM_SEPOLIA,
  [ARBITRUM_SEPOLIA.chainId]: ARBITRUM_SEPOLIA
}

// 根据 chainId 获取网络配置
export function getChainConfig(chainId) {
  return SUPPORTED_CHAINS[chainId]
}

// 判断是否为支持的网络
export function isSupportedChain(chainId) {
  return chainId in SUPPORTED_CHAINS
}
