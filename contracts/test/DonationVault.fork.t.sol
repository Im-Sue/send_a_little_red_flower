// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {DonationVault} from "../src/DonationVault.sol";
import {BaseIsmpModule, IncomingPostRequest, PostRequest} from "../src/interfaces/IISMPCore.sol";

/**
 * @title DonationVaultForkTest
 * @notice Fork 测试 - 验证 DonationVault 与真实 Arbitrum Sepolia ISMP Host 的集成
 *
 * 运行方式：
 * forge test --fork-url $ARBITRUM_SEPOLIA_RPC_URL --match-contract DonationVaultForkTest -vvv
 */
contract DonationVaultForkTest is Test {
    DonationVault public vault;

    // 真实的 Arbitrum Sepolia ISMP Host 地址
    address constant ARBITRUM_ISMP_HOST = 0x3435bD7e5895356535459D6087D1eB982DAd90e7;

    address public owner = address(this);
    address public donor = address(0xABCD);
    address public beneficiary = address(0xBEEF);

    uint256 public eventId;

    function setUp() public {
        // 部署 DonationVault，使用真实的 ISMP Host
        vault = new DonationVault(ARBITRUM_ISMP_HOST);

        // 创建测试事件
        eventId = vault.createEvent(
            "Test Event",
            "Fork test event",
            10000e18,
            block.timestamp + 30 days,
            beneficiary
        );

        console.log("============================================");
        console.log("Fork Test Setup Complete");
        console.log("============================================");
        console.log("ISMP Host:", ARBITRUM_ISMP_HOST);
        console.log("DonationVault:", address(vault));
        console.log("Event ID:", eventId);
        console.log("Owner:", owner);
        console.log("============================================");
    }

    /**
     * @notice 测试 ISMP Host 地址配置是否正确
     */
    function testISMPHostConfiguration() public view {
        address configuredHost = vault.host();
        console.log("Configured ISMP Host:", configuredHost);

        assertEq(configuredHost, ARBITRUM_ISMP_HOST, "ISMP Host mismatch");
    }

    /**
     * @notice 测试模拟的跨链消息接收
     * 注意：在 fork 环境中，我们无法直接触发真实的 ISMP Host 调用
     * 但我们可以验证 onAccept 函数的访问控制
     */
    function testOnlyHostCanCallOnAccept() public {
        // 构造模拟的跨链消息
        PostRequest memory request = PostRequest({
            source: bytes("EVM-11155111"), // Sepolia
            dest: bytes("EVM-421614"),     // Arbitrum Sepolia
            nonce: 1,
            from: abi.encodePacked(address(0x1234)),
            to: abi.encodePacked(address(vault)),
            timeoutTimestamp: uint64(block.timestamp + 3600),
            body: abi.encode(eventId, donor, 100e18, block.timestamp)
        });

        IncomingPostRequest memory incoming = IncomingPostRequest({
            request: request,
            relayer: address(0x5678)
        });

        // 非 Host 调用应该失败
        vm.expectRevert(BaseIsmpModule.UnauthorizedCall.selector);
        vault.onAccept(incoming);

        console.log("Access control working: only host can call onAccept");
    }

    /**
     * @notice 测试从 ISMP Host 调用 onAccept（模拟）
     */
    function testOnAcceptFromHost() public {
        uint256 donationAmount = 100e18;

        // 构造跨链消息
        PostRequest memory request = PostRequest({
            source: bytes("EVM-11155111"),
            dest: bytes("EVM-421614"),
            nonce: 1,
            from: abi.encodePacked(address(0x1234)),
            to: abi.encodePacked(address(vault)),
            timeoutTimestamp: uint64(block.timestamp + 3600),
            body: abi.encode(eventId, donor, donationAmount, block.timestamp)
        });

        IncomingPostRequest memory incoming = IncomingPostRequest({
            request: request,
            relayer: address(0x5678)
        });

        // 模拟 ISMP Host 调用
        vm.prank(ARBITRUM_ISMP_HOST);
        vault.onAccept(incoming);

        console.log("\n============================================");
        console.log("Cross-chain message accepted!");
        console.log("============================================");

        // 验证捐款已处理
        (
            ,
            ,
            ,
            uint256 currentAmount,
            ,
            ,

        ) = vault.events(eventId);

        assertEq(currentAmount, donationAmount, "Donation amount mismatch");

        // 验证小红花已铸造
        uint256 expectedFlowers = donationAmount * vault.FLOWER_RATIO();
        assertEq(vault.balanceOf(donor), expectedFlowers, "Flower balance mismatch");

        console.log("Donation amount:", donationAmount);
        console.log("Flowers minted:", expectedFlowers);
        console.log("============================================\n");
    }

    /**
     * @notice 测试代币元数据
     */
    function testTokenMetadata() public view {
        assertEq(vault.name(), "RedFlower");
        assertEq(vault.symbol(), "FLOWER");
        assertEq(vault.FLOWER_RATIO(), 100);

        console.log("Token Name:", vault.name());
        console.log("Token Symbol:", vault.symbol());
        console.log("Flower Ratio:", vault.FLOWER_RATIO());
    }

    /**
     * @notice 测试事件创建和查询
     */
    function testEventCreationAndQuery() public view {
        (
            string memory title,
            string memory description,
            uint256 targetAmount,
            uint256 currentAmount,
            uint256 deadline,
            address eventBeneficiary,
            bool isActive
        ) = vault.events(eventId);

        assertEq(title, "Test Event");
        assertEq(description, "Fork test event");
        assertEq(targetAmount, 10000e18);
        assertEq(currentAmount, 0);
        assertTrue(deadline > block.timestamp);
        assertEq(eventBeneficiary, beneficiary);
        assertTrue(isActive);

        console.log("Event verified successfully");
    }

    /**
     * @notice 测试多笔跨链捐款
     */
    function testMultipleCrossChainDonations() public {
        uint256 donationCount = 5;
        uint256 amountPerDonation = 50e18;

        for (uint256 i = 0; i < donationCount; i++) {
            address currentDonor = address(uint160(0xABCD + i));

            PostRequest memory request = PostRequest({
                source: bytes("EVM-11155111"),
                dest: bytes("EVM-421614"),
                nonce: uint64(i + 1),
                from: abi.encodePacked(address(0x1234)),
                to: abi.encodePacked(address(vault)),
                timeoutTimestamp: uint64(block.timestamp + 3600),
                body: abi.encode(eventId, currentDonor, amountPerDonation, block.timestamp)
            });

            IncomingPostRequest memory incoming = IncomingPostRequest({
                request: request,
                relayer: address(0x5678)
            });

            vm.prank(ARBITRUM_ISMP_HOST);
            vault.onAccept(incoming);
        }

        console.log("\n============================================");
        console.log("Multiple donations test completed");
        console.log("============================================");

        // 验证总金额
        (
            ,
            ,
            ,
            uint256 totalAmount,
            ,
            ,

        ) = vault.events(eventId);

        assertEq(totalAmount, amountPerDonation * donationCount);
        console.log("Total donations:", totalAmount);
        console.log("Donation count:", donationCount);
        console.log("============================================\n");
    }

    /**
     * @notice 测试消息解码
     */
    function testMessageDecoding() public pure {
        uint256 testEventId = 1;
        address testDonor = address(0xABCD);
        uint256 testAmount = 100e18;
        uint256 testTimestamp = 1234567890;

        // 编码
        bytes memory encoded = abi.encode(testEventId, testDonor, testAmount, testTimestamp);

        // 解码
        (uint256 decodedEventId, address decodedDonor, uint256 decodedAmount, uint256 decodedTimestamp) =
            abi.decode(encoded, (uint256, address, uint256, uint256));

        // 验证
        assert(decodedEventId == testEventId);
        assert(decodedDonor == testDonor);
        assert(decodedAmount == testAmount);
        assert(decodedTimestamp == testTimestamp);

        console.log("Message encoding/decoding verified");
    }
}
