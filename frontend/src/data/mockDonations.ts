// Mock donation data for demonstration
// 注意：eventId=1 对应链上 DonationVault 合约中真实存在的事件
export interface Donation {
    id: string
    donor: string
    amount: number
    tokenSymbol: string
    flowersReceived: number
    timestamp: Date
    eventId: number
    eventTitle: string
    sourceChain: string
    targetChain: string
    status: 'pending' | 'confirmed' | 'completed'
    txHash: string
}

// Generate mock data - 使用真实的测试地址
export const mockDonations: Donation[] = [
    {
        id: '1',
        donor: '0xF344DC8d71f752D87Ef1c8662aF671973010249f', // 实际测试捐赠者
        amount: 100,
        tokenSymbol: 'USDT',
        flowersReceived: 10000,
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        eventId: 1, // 对应链上真实事件
        eventTitle: '小明白血病医疗救助',
        sourceChain: 'Ethereum Sepolia',
        targetChain: 'Arbitrum Sepolia',
        status: 'completed',
        txHash: '0x652c834974d400ffd7178c5dbae0494fbd96594eab0c06d23ee389294da8f044' // 实际跨链交易
    },
    {
        id: '2',
        donor: '0xabcdef1234567890abcdef1234567890abcdef12',
        amount: 50,
        tokenSymbol: 'USDT',
        flowersReceived: 5000,
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        eventId: 1,
        eventTitle: '某某小朋友医疗救助',
        sourceChain: 'Paseo',
        targetChain: 'Paseo',
        status: 'completed',
        txHash: '0x1234abcd567890abcdef1234567890abcdef1234567890abcdef1234567890cd'
    },
    {
        id: '3',
        donor: '0x9876543210fedcba9876543210fedcba98765432',
        amount: 200,
        tokenSymbol: 'USDT',
        flowersReceived: 20000,
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        eventId: 1,
        eventTitle: '某某小朋友医疗救助',
        sourceChain: 'Sepolia',
        targetChain: 'Paseo',
        status: 'completed',
        txHash: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321'
    },
    {
        id: '4',
        donor: '0x5555666677778888999900001111222233334444',
        amount: 25,
        tokenSymbol: 'USDT',
        flowersReceived: 2500,
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        eventId: 1,
        eventTitle: '某某小朋友医疗救助',
        sourceChain: 'Sepolia',
        targetChain: 'Paseo',
        status: 'completed',
        txHash: '0x4444555566667777888899990000111122223333444455556666777788889999'
    },
    {
        id: '5',
        donor: '0xaaaabbbbccccddddeeeeffffgggg11112222333',
        amount: 500,
        tokenSymbol: 'USDT',
        flowersReceived: 50000,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        eventId: 1,
        eventTitle: '某某小朋友医疗救助',
        sourceChain: 'Paseo',
        targetChain: 'Paseo',
        status: 'completed',
        txHash: '0xbbbcccdddeeefffaaa111222333444555666777888999000aaabbbcccdddeee'
    },
]

// Stats calculated from donations
export const mockStats = {
    totalAmount: 875,
    donationCount: 5,
    totalFlowers: 87500,
    uniqueDonors: 5
}
