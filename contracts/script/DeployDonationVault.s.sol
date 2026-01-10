// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {DonationVault} from "../src/DonationVault.sol";

/**
 * @title DeployDonationVault
 * @notice 部署 DonationVault 到 Arbitrum Sepolia
 *
 * 使用方法：
 * 1. 配置 .env 文件（参考 .env.example）
 * 2. 运行部署命令：
 *    forge script script/DeployDonationVault.s.sol:DeployDonationVault \
 *      --rpc-url $ARBITRUM_SEPOLIA_RPC_URL \
 *      --broadcast \
 *      --verify \
 *      -vvvv
 */
contract DeployDonationVault is Script {

    // Arbitrum Sepolia ISMP Host 地址
    address constant ARBITRUM_SEPOLIA_ISMP_HOST = 0x3435bD7e5895356535459D6087D1eB982DAd90e7;

    function run() external returns (DonationVault vault) {
        // 从环境变量读取私钥
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        console.log("===========================================");
        console.log("Deploying DonationVault to Arbitrum Sepolia");
        console.log("===========================================");
        console.log("Deployer:", vm.addr(deployerPrivateKey));
        console.log("ISMP Host:", ARBITRUM_SEPOLIA_ISMP_HOST);
        console.log("");

        // 开始广播交易
        vm.startBroadcast(deployerPrivateKey);

        // 部署 DonationVault
        vault = new DonationVault(ARBITRUM_SEPOLIA_ISMP_HOST);

        vm.stopBroadcast();

        // 输出部署信息
        console.log("");
        console.log("===========================================");
        console.log("Deployment Successful!");
        console.log("===========================================");
        console.log("DonationVault Address:", address(vault));
        console.log("Token Name:", vault.name());
        console.log("Token Symbol:", vault.symbol());
        console.log("FLOWER Ratio:", vault.FLOWER_RATIO());
        console.log("");
        console.log("Next Step: Create a donation event");
        console.log("Use the following command:");
        console.log("cast send", address(vault));
        console.log('  "createEvent(string,string,uint256,uint256,address)"');
        console.log('  "Help Xiaoming" "Treatment funds" 10000000000000000000000');
        console.log('  <deadline_timestamp> <beneficiary_address>');
        console.log('  --rpc-url $ARBITRUM_SEPOLIA_RPC_URL');
        console.log('  --private-key $PRIVATE_KEY');
        console.log("===========================================");

        return vault;
    }
}
