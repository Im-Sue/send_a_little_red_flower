/**
 * DonationVault 合约服务
 * 用于从 Arbitrum Sepolia 读取事件和捐款数据
 * 
 * 注意：使用公共 RPC 读取数据，不切换用户钱包网络
 */

import { JsonRpcProvider, Contract, Interface } from 'ethers'
import { ARBITRUM_SEPOLIA } from '../contracts/config'
import DonationVaultABI from '../contracts/DonationVault.abi.json'

// 链上事件数据结构
export interface OnChainEvent {
    title: string
    description: string
    targetAmount: bigint
    currentAmount: bigint
    deadline: bigint
    beneficiary: string
    isActive: boolean
}

// 链上捐款记录结构
export interface OnChainDonation {
    donor: string
    amount: bigint
    timestamp: bigint
    flowersReceived: bigint
}

// 使用公共 RPC provider，避免切换用户钱包网络
const provider = new JsonRpcProvider(ARBITRUM_SEPOLIA.rpcUrl)
const contractInterface = new Interface(DonationVaultABI)

/**
 * 获取事件详情 - 使用底层调用避免 ABI 解析问题
 */
export async function getEvent(eventId: number): Promise<OnChainEvent | null> {
    try {
        console.log('🔍 [getEvent] 开始获取事件详情')
        console.log('🔍 [getEvent] eventId:', eventId)
        console.log('🔍 [getEvent] RPC URL:', ARBITRUM_SEPOLIA.rpcUrl)
        console.log('🔍 [getEvent] 合约地址:', ARBITRUM_SEPOLIA.contracts.donationVault)

        // 使用底层 eth_call
        const data = contractInterface.encodeFunctionData('getEvent', [eventId])
        console.log('🔍 [getEvent] 编码的调用数据:', data)

        const result = await provider.call({
            to: ARBITRUM_SEPOLIA.contracts.donationVault,
            data: data
        })

        console.log('🔍 [getEvent] 原始返回数据:', result)

        const decoded = contractInterface.decodeFunctionResult('getEvent', result)
        console.log('✅ [getEvent] 解码后数据:', decoded)

        const eventData = decoded[0]
        console.log('✅ [getEvent] 事件数据:', eventData)
        console.log('✅ [getEvent] title:', eventData.title)
        console.log('✅ [getEvent] targetAmount (bigint):', eventData.targetAmount.toString())
        console.log('✅ [getEvent] currentAmount (bigint):', eventData.currentAmount.toString())
        console.log('✅ [getEvent] deadline (bigint):', eventData.deadline.toString())
        console.log('✅ [getEvent] isActive:', eventData.isActive)

        const eventResult: OnChainEvent = {
            title: eventData.title,
            description: eventData.description,
            targetAmount: eventData.targetAmount,
            currentAmount: eventData.currentAmount,
            deadline: eventData.deadline,
            beneficiary: eventData.beneficiary,
            isActive: eventData.isActive
        }

        console.log('✅ [getEvent] 返回结果:', eventResult)
        return eventResult
    } catch (error) {
        console.error('❌ [getEvent] 获取事件失败:', error)
        return null
    }
}

/**
 * 获取事件的所有捐款记录
 */
export async function getEventDonations(eventId: number): Promise<OnChainDonation[]> {
    try {
        console.log('🔍 [getEventDonations] 开始获取捐款记录, eventId:', eventId)

        const contract = new Contract(
            ARBITRUM_SEPOLIA.contracts.donationVault,
            DonationVaultABI,
            provider
        )

        const donations: any = await contract.getEventDonations(eventId)

        console.log('✅ [getEventDonations] 原始捐款记录:', donations)
        console.log('✅ [getEventDonations] 记录数量:', donations.length)

        const result: OnChainDonation[] = donations.map((d: any) => ({
            donor: d.donor,
            amount: d.amount,
            timestamp: d.timestamp,
            flowersReceived: d.flowersReceived
        }))

        console.log('✅ [getEventDonations] 返回结果:', result)
        return result
    } catch (error) {
        console.error('❌ [getEventDonations] 获取捐款记录失败:', error)
        return []
    }
}

/**
 * 获取用户的 FLOWER 余额
 */
export async function getFlowerBalance(address: string): Promise<bigint> {
    try {
        console.log('🔍 [getFlowerBalance] 查询余额, address:', address)

        const contract = new Contract(
            ARBITRUM_SEPOLIA.contracts.donationVault,
            DonationVaultABI,
            provider
        )

        const balance: bigint = await contract.balanceOf(address)

        console.log('✅ [getFlowerBalance] 余额 (bigint):', balance.toString())
        return balance
    } catch (error) {
        console.error('❌ [getFlowerBalance] 查询余额失败:', error)
        return BigInt(0)
    }
}
