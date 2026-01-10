// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {DonationVault} from "../src/DonationVault.sol";

/**
 * @title CreateEvent
 * @notice 在 DonationVault 创建捐款事件
 *
 * 使用方法：
 * 1. 确保 .env 中配置了 DONATION_VAULT_ADDRESS
 * 2. 运行命令：
 *    forge script script/CreateEvent.s.sol:CreateEvent \
 *      --rpc-url $ARBITRUM_SEPOLIA_RPC_URL \
 *      --broadcast \
 *      -vvvv
 */
contract CreateEvent is Script {

    function run() external returns (uint256 eventId) {
        // 从环境变量读取配置
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address vaultAddress = vm.envAddress("DONATION_VAULT_ADDRESS");

        DonationVault vault = DonationVault(vaultAddress);

        // 事件参数
        string memory title = "Help Xiaoming Treatment";
        string memory description = "Leukemia treatment funds, target 10,000 USDT";
        uint256 targetAmount = 10000e18;  // 10,000 USDT (18 decimals)
        uint256 deadline = block.timestamp + 30 days;  // Deadline in 30 days
        address beneficiary = vm.addr(deployerPrivateKey);  // Deployer as beneficiary

        console.log("===========================================");
        console.log("Creating Donation Event in DonationVault");
        console.log("===========================================");
        console.log("Vault Address:", vaultAddress);
        console.log("Creator:", vm.addr(deployerPrivateKey));
        console.log("Event Title:", title);
        console.log("Target Amount:", targetAmount);
        console.log("Deadline:", deadline);
        console.log("Beneficiary:", beneficiary);
        console.log("");

        // 开始广播交易
        vm.startBroadcast(deployerPrivateKey);

        // 创建事件
        eventId = vault.createEvent(
            title,
            description,
            targetAmount,
            deadline,
            beneficiary
        );

        vm.stopBroadcast();

        // 输出结果
        console.log("");
        console.log("===========================================");
        console.log("Event Created Successfully!");
        console.log("===========================================");
        console.log("Event ID:", eventId);
        console.log("");
        console.log("Add this Event ID to .env file:");
        console.log("DEFAULT_EVENT_ID=", vm.toString(eventId));
        console.log("");
        console.log("Query event info:");
        console.log('cast call', vaultAddress);
        console.log('  "getEvent(uint256)" ', vm.toString(eventId));
        console.log('  --rpc-url $ARBITRUM_SEPOLIA_RPC_URL');
        console.log("===========================================");

        return eventId;
    }
}
