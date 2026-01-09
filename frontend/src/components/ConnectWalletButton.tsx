import { useWallet } from '../contexts/WalletContext'

function ConnectWalletButton() {
    const { address, isConnecting, isConnected, connect, disconnect, chainId } = useWallet()

    // Sepolia chain ID
    const isOnSepolia = chainId === '0xaa36a7'

    // Format address for display
    const formatAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`
    }

    if (isConnected && address) {
        return (
            <div className="wallet-connected">
                {!isOnSepolia && (
                    <span className="wallet-network-warning">
                        ⚠️ Wrong Network
                    </span>
                )}
                <button
                    className="wallet-btn wallet-btn-connected"
                    onClick={disconnect}
                    title={address}
                >
                    <span className="wallet-status-dot"></span>
                    {formatAddress(address)}
                </button>
            </div>
        )
    }

    return (
        <button
            className="navbar-btn"
            onClick={connect}
            disabled={isConnecting}
        >
            {isConnecting ? (
                <>
                    <span className="wallet-spinner"></span>
                    连接中...
                </>
            ) : (
                '连接钱包'
            )}
        </button>
    )
}

export default ConnectWalletButton
