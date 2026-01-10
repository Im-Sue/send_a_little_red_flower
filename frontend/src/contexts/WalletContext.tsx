import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { BrowserProvider, formatEther } from 'ethers'

// Sepolia Testnet Chain ID
const SEPOLIA_CHAIN_ID = '0xaa36a7' // 11155111 in hex

interface WalletContextType {
    address: string | null
    balance: string | null
    isConnecting: boolean
    isConnected: boolean
    chainId: string | null
    connect: () => Promise<void>
    disconnect: () => void
    switchToSepolia: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | null>(null)

export function useWallet() {
    const context = useContext(WalletContext)
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider')
    }
    return context
}

interface WalletProviderProps {
    children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
    const [address, setAddress] = useState<string | null>(null)
    const [balance, setBalance] = useState<string | null>(null)
    const [isConnecting, setIsConnecting] = useState(false)
    const [chainId, setChainId] = useState<string | null>(null)

    const isConnected = !!address

    // Get balance for address
    const fetchBalance = useCallback(async (addr: string) => {
        if (!window.ethereum) return
        try {
            const provider = new BrowserProvider(window.ethereum)
            const bal = await provider.getBalance(addr)
            setBalance(formatEther(bal))
        } catch (err) {
            console.error('Failed to fetch balance:', err)
        }
    }, [])

    // Switch to Sepolia testnet
    const switchToSepolia = useCallback(async () => {
        if (!window.ethereum) return

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: SEPOLIA_CHAIN_ID }],
            })
        } catch (switchError: unknown) {
            // This error code indicates that the chain has not been added to MetaMask
            if ((switchError as { code?: number })?.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: SEPOLIA_CHAIN_ID,
                            chainName: 'Sepolia Testnet',
                            nativeCurrency: {
                                name: 'Sepolia ETH',
                                symbol: 'ETH',
                                decimals: 18
                            },
                            rpcUrls: ['https://sepolia.infura.io/v3/'],
                            blockExplorerUrls: ['https://sepolia.etherscan.io']
                        }],
                    })
                } catch (addError) {
                    console.error('Failed to add Sepolia network:', addError)
                }
            } else {
                console.error('Failed to switch network:', switchError)
            }
        }
    }, [])

    // Connect wallet
    const connect = useCallback(async () => {
        if (!window.ethereum) {
            alert('请先安装支持 EIP-1193 的钱包（如 MetaMask、OKX Wallet 等）')
            return
        }

        setIsConnecting(true)
        try {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            }) as string[]

            if (accounts.length > 0) {
                setAddress(accounts[0])
                await fetchBalance(accounts[0])

                // Get current chain
                const currentChainId = await window.ethereum.request({
                    method: 'eth_chainId'
                }) as string
                setChainId(currentChainId)

                // Switch to Sepolia if not already on it
                if (currentChainId !== SEPOLIA_CHAIN_ID) {
                    await switchToSepolia()
                }
            }
        } catch (err) {
            console.error('Failed to connect wallet:', err)
        } finally {
            setIsConnecting(false)
        }
    }, [fetchBalance, switchToSepolia])

    // Disconnect wallet
    const disconnect = useCallback(() => {
        setAddress(null)
        setBalance(null)
        setChainId(null)
    }, [])

    // Listen for account changes
    useEffect(() => {
        if (!window.ethereum) return

        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length === 0) {
                disconnect()
            } else {
                setAddress(accounts[0])
                fetchBalance(accounts[0])
            }
        }

        const handleChainChanged = (newChainId: string) => {
            setChainId(newChainId)
        }

        window.ethereum.on('accountsChanged', handleAccountsChanged)
        window.ethereum.on('chainChanged', handleChainChanged)

        return () => {
            window.ethereum?.removeListener('accountsChanged', handleAccountsChanged)
            window.ethereum?.removeListener('chainChanged', handleChainChanged)
        }
    }, [disconnect, fetchBalance])

    // Check if already connected on mount
    useEffect(() => {
        if (!window.ethereum) return

        window.ethereum.request({ method: 'eth_accounts' })
            .then((accounts: string[]) => {
                if (accounts.length > 0) {
                    setAddress(accounts[0])
                    fetchBalance(accounts[0])
                    window.ethereum?.request({ method: 'eth_chainId' })
                        .then((id: string) => setChainId(id))
                }
            })
            .catch(console.error)
    }, [fetchBalance])

    return (
        <WalletContext.Provider value={{
            address,
            balance,
            isConnecting,
            isConnected,
            chainId,
            connect,
            disconnect,
            switchToSepolia
        }}>
            {children}
        </WalletContext.Provider>
    )
}
