// Mock donation data for demonstration
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

// Generate mock data
export const mockDonations: Donation[] = [
    {
        id: '1',
        donor: '0x1234567890abcdef1234567890abcdef12345678',
        amount: 100,
        tokenSymbol: 'USDT',
        flowersReceived: 10000,
        timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        eventId: 1,
        eventTitle: '某某小朋友医疗救助',
        sourceChain: 'Sepolia',
        targetChain: 'Paseo',
        status: 'completed',
        txHash: '0xabcd1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab'
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
