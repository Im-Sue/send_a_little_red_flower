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
        title: '山区儿童教育基金',
        description: '云贵高原偏远山区的孩子们面临着严峻的教育资源匮乏问题。这里有超过500名学龄儿童，却只有一所破旧的希望小学和3名支教老师。我们希望为这些渴望知识的孩子筹集教育基金，用于：购买课本和学习用品、改善教室基础设施、为支教老师提供生活补贴、建立数字化教学设备等。每一份捐款都将通过 Hyperbridge 跨链协议安全转账，所有资金使用情况全程透明可追溯，您将获得小红花代币作为爱心凭证。让我们一起为山区孩子点亮求学之路！',
        targetAmount: 50000,
        currentAmount: 32500,
        deadline: new Date('2026-02-15'),
        beneficiary: '0xF344DC8d71f752D87Ef1c8662aF671973010249f', // 实际测试地址
        beneficiaryName: '云贵希望小学',
        isActive: true,
        donorCount: 156,
        category: 'education'
    },
    {
        id: 2,
        title: '留守儿童关爱计划',
        description: '为农村留守儿童提供心理辅导、课后托管和兴趣培养服务。这些孩子的父母常年在外务工，他们需要更多的关爱和陪伴。我们将建立儿童活动中心，配备专业社工和志愿者。',
        targetAmount: 30000,
        currentAmount: 18750,
        deadline: new Date('2026-03-01'),
        beneficiary: '0xabcdef1234567890abcdef1234567890abcdef12',
        beneficiaryName: '阳光儿童之家',
        isActive: true,
        donorCount: 89,
        category: 'community'
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
