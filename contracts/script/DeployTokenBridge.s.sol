// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {TokenBridge} from "../src/TokenBridge.sol";
import {StateMachine} from "../src/interfaces/IISMPCore.sol";

/**
 * @title DeployTokenBridge
 * @notice 部署 TokenBridge 到 Ethereum Sepolia
 *
 * 使用方法：
 * 1. 确保已部署 DonationVault 并创建了事件
 * 2. 配置 .env 文件，设置：
 *    - DONATION_VAULT_ADDRESS（DonationVault 地址）
 *    - DEFAULT_EVENT_ID（默认事件 ID）
 * 3. 运行部署命令：
 *    forge script script/DeployTokenBridge.s.sol:DeployTokenBridge \
 *      --rpc-url $SEPOLIA_RPC_URL \
 *      --broadcast \
 *      --verify \
 *      -vvvv
 */
contract DeployTokenBridge is Script {

    // Ethereum Sepolia ISMP Host 地址
    address constant SEPOLIA_ISMP_HOST = 0x2EdB74C269948b60ec1000040E104cef0eABaae8;

    // Arbitrum Sepolia Chain ID
    uint256 constant ARBITRUM_SEPOLIA_CHAIN_ID = 421614;

    function run() external returns (TokenBridge bridge) {
        // 从环境变量读取配置
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address donationVault = vm.envAddress("DONATION_VAULT_ADDRESS");
        uint256 defaultEventId = vm.envUint("DEFAULT_EVENT_ID");

        // 生成目标链标识
        bytes memory destChainId = StateMachine.evm(ARBITRUM_SEPOLIA_CHAIN_ID);

        console.log("===========================================");
        console.log("Deploying TokenBridge to Ethereum Sepolia");
        console.log("===========================================");
        console.log("Deployer:", vm.addr(deployerPrivateKey));
        console.log("ISMP Host:", SEPOLIA_ISMP_HOST);
        console.log("DonationVault:", donationVault);
        console.log("Dest Chain ID:", string(destChainId));
        console.log("Default Event ID:", defaultEventId);
        console.log("");

        // 开始广播交易
        vm.startBroadcast(deployerPrivateKey);

        // 部署 TokenBridge
        bridge = new TokenBridge(
            SEPOLIA_ISMP_HOST,
            donationVault,
            destChainId,
            defaultEventId
        );

        vm.stopBroadcast();

        // 输出部署信息
        console.log("");
        console.log("===========================================");
        console.log("Deployment Successful!");
        console.log("===========================================");
        console.log("TokenBridge Address:", address(bridge));
        console.log("ISMP Host:", address(bridge.ismpHost()));
        console.log("DonationVault:", bridge.donationVault());
        console.log("Dest Chain ID:", string(bridge.destChainId()));
        console.log("Default Event ID:", bridge.defaultEventId());
        console.log("");
        console.log("Next Step: Test cross-chain donation");
        console.log("1. Prepare test token (USDT or Mock ERC20)");
        console.log("2. Approve token:");
        console.log('   cast send <TOKEN_ADDRESS> "approve(address,uint256)"');
        console.log("  ", address(bridge), "<AMOUNT>");
        console.log('   --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY');
        console.log("");
        console.log("3. Make donation (requires cross-chain fee):");
        console.log('   cast send', address(bridge));
        console.log('     "donate(address,uint256,uint256)" \\');
        console.log('     <TOKEN_ADDRESS> <AMOUNT>', defaultEventId, "\\");
        console.log('     --value 0.001ether \\');
        console.log('     --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY');
        console.log("===========================================");

        return bridge;
    }
}
