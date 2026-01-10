/**
 * 合约 ABIs
 * 
 * 用于前端与智能合约交互的 ABI 定义
 */

// TokenBridge ABI (Ethereum Sepolia) - 捐款入口合约
export const TOKEN_BRIDGE_ABI = [
    {
        type: "function",
        name: "donate",
        inputs: [
            { name: "token", type: "address" },
            { name: "amount", type: "uint256" },
            { name: "eventId", type: "uint256" }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "donate",
        inputs: [
            { name: "token", type: "address" },
            { name: "amount", type: "uint256" }
        ],
        outputs: [],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "defaultEventId",
        inputs: [],
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "getFeeTokenBalance",
        inputs: [],
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view"
    },
    {
        type: "event",
        name: "DonationInitiated",
        inputs: [
            { name: "donor", type: "address", indexed: true },
            { name: "amount", type: "uint256", indexed: false },
            { name: "eventId", type: "uint256", indexed: true },
            { name: "messageId", type: "bytes32", indexed: false }
        ],
        anonymous: false
    }
] as const

// ERC20 ABI - 用于 USDT approve 和 balanceOf
export const ERC20_ABI = [
    {
        type: "function",
        name: "approve",
        inputs: [
            { name: "spender", type: "address" },
            { name: "value", type: "uint256" }
        ],
        outputs: [{ name: "", type: "bool" }],
        stateMutability: "nonpayable"
    },
    {
        type: "function",
        name: "allowance",
        inputs: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" }
        ],
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "balanceOf",
        inputs: [{ name: "account", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "decimals",
        inputs: [],
        outputs: [{ name: "", type: "uint8" }],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "symbol",
        inputs: [],
        outputs: [{ name: "", type: "string" }],
        stateMutability: "view"
    }
] as const

// DonationVault ABI (Arbitrum Sepolia) - 金库合约，用于读取事件信息
export const DONATION_VAULT_ABI = [
    {
        type: "function",
        name: "eventCount",
        inputs: [],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "getEvent",
        inputs: [{ name: "eventId", type: "uint256", internalType: "uint256" }],
        outputs: [
            {
                name: "",
                type: "tuple",
                internalType: "struct DonationVault.DonationEvent",
                components: [
                    { name: "title", type: "string", internalType: "string" },
                    { name: "description", type: "string", internalType: "string" },
                    { name: "targetAmount", type: "uint256", internalType: "uint256" },
                    { name: "currentAmount", type: "uint256", internalType: "uint256" },
                    { name: "deadline", type: "uint256", internalType: "uint256" },
                    { name: "beneficiary", type: "address", internalType: "address" },
                    { name: "isActive", type: "bool", internalType: "bool" }
                ]
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "getEventDonations",
        inputs: [{ name: "eventId", type: "uint256", internalType: "uint256" }],
        outputs: [
            {
                name: "",
                type: "tuple[]",
                internalType: "struct DonationVault.DonationRecord[]",
                components: [
                    { name: "donor", type: "address", internalType: "address" },
                    { name: "amount", type: "uint256", internalType: "uint256" },
                    { name: "timestamp", type: "uint256", internalType: "uint256" },
                    { name: "flowersReceived", type: "uint256", internalType: "uint256" }
                ]
            }
        ],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "getDonorFlowers",
        inputs: [{ name: "donor", type: "address", internalType: "address" }],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "balanceOf",
        inputs: [{ name: "account", type: "address", internalType: "address" }],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view"
    },
    {
        type: "function",
        name: "FLOWER_RATIO",
        inputs: [],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view"
    }
] as const

