// Mock donation events data for demonstration
// 注意：第一个事件 ID=1 对应链上 DonationVault 合约中真实存在的事件
export interface DonationEvent {
    id: number
    title: string
    description: string
    targetAmount: number
    currentAmount: number
    deadline: Date
    beneficiary: string
    beneficiaryName: string
    isActive: boolean
    donorCount: number
    imageUrl?: string
    category: 'medical' | 'education' | 'disaster' | 'community'
}

// Generate mock events data
// 事件 ID=1 对应 DonationVault 合约中的真实事件（Arbitrum Sepolia）
export const mockEvents: DonationEvent[] = [
    {
        id: 1, // 重要：此 ID 对应链上真实事件
        title: '小明白血病医疗救助',
        description: '8岁的小明患有急性淋巴细胞白血病，需要进行骨髓移植手术。家庭经济困难，急需社会各界的帮助。所有捐款将通过 Hyperbridge 跨链协议安全转账，并获得小红花代币作为感谢凭证。',
        targetAmount: 50000,
        currentAmount: 32500,
        deadline: new Date('2026-02-15'),
        beneficiary: '0xF344DC8d71f752D87Ef1c8662aF671973010249f', // 实际测试地址
        beneficiaryName: '小明家庭',
        isActive: true,
        donorCount: 156,
        category: 'medical'
    },
    {
        id: 2,
        title: '山区儿童教育基金',
        description: '为偏远山区的孩子们筹集教育资金，包括书本费、学杂费和学习用品，让每一个孩子都有读书的机会。',
        targetAmount: 30000,
        currentAmount: 18750,
        deadline: new Date('2026-03-01'),
        beneficiary: '0xabcdef1234567890abcdef1234567890abcdef12',
        beneficiaryName: '希望小学',
        isActive: true,
        donorCount: 89,
        category: 'education'
    },
    {
        id: 3,
        title: '洪水灾区物资援助',
        description: '某地区遭受严重洪灾，急需帐篷、饮用水、食品和医疗物资等生活必需品，帮助灾民度过难关。',
        targetAmount: 100000,
        currentAmount: 75000,
        deadline: new Date('2026-01-31'),
        beneficiary: '0x9876543210fedcba9876543210fedcba98765432',
        beneficiaryName: '灾区重建委员会',
        isActive: true,
        donorCount: 423,
        category: 'disaster'
    },
    {
        id: 4,
        title: '流浪动物救助站',
        description: '为城市流浪动物提供食物、医疗和庇护所，帮助它们找到新的家庭，传递爱与温暖。',
        targetAmount: 15000,
        currentAmount: 15000,
        deadline: new Date('2026-01-10'),
        beneficiary: '0x5555666677778888999900001111222233334444',
        beneficiaryName: '爱心动物之家',
        isActive: false,
        donorCount: 67,
        category: 'community'
    }
]

// Category labels and colors
export const categoryConfig: Record<DonationEvent['category'], { label: string; color: string }> = {
    medical: { label: '医疗救助', color: '#f43f5e' },
    education: { label: '教育助学', color: '#3b82f6' },
    disaster: { label: '灾害救援', color: '#f59e0b' },
    community: { label: '社区公益', color: '#22c55e' }
}
