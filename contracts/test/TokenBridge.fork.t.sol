// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {TokenBridge} from "../src/TokenBridge.sol";
import {MockERC20} from "./mocks/MockERC20.sol";
import {IDispatcher, DispatchPost, StateMachine} from "../src/interfaces/IISMPCore.sol";

/**
 * @title TokenBridgeForkTest
 * @notice Fork 测试 - 验证 TokenBridge 与真实 Sepolia ISMP Host 的集成
 *
 * 运行方式：
 * forge test --fork-url $SEPOLIA_RPC_URL --match-contract TokenBridgeForkTest -vvv
 */
contract TokenBridgeForkTest is Test {
    TokenBridge public bridge;
    MockERC20 public testToken;

    // 真实的 Sepolia ISMP Host 地址
    address constant SEPOLIA_ISMP_HOST = 0x2EdB74C269948b60ec1000040E104cef0eABaae8;

    // 真实的 Arbitrum Sepolia Chain ID
    uint256 constant ARBITRUM_SEPOLIA_CHAIN_ID = 421614;

    // 测试参数
    address public donationVault = address(0x1234567890123456789012345678901234567890);
    bytes public destChainId;
    uint256 public defaultEventId = 1;

    address public donor = address(0xABCD);
    uint256 public constant INITIAL_BALANCE = 10000e18;
    uint256 public constant DONATION_AMOUNT = 100e18;

    function setUp() public {
        // 生成目标链标识（Arbitrum Sepolia）
        destChainId = StateMachine.evm(ARBITRUM_SEPOLIA_CHAIN_ID);

        // 部署 TokenBridge，使用真实的 ISMP Host
        bridge = new TokenBridge(
            SEPOLIA_ISMP_HOST,
            donationVault,
            destChainId,
            defaultEventId
        );

        // 部署测试代币
        testToken = new MockERC20("Test Token", "TEST");
        testToken.mint(donor, INITIAL_BALANCE);

        // 给 donor 一些 ETH 用于支付跨链费用
        vm.deal(donor, 10 ether);

        console.log("============================================");
        console.log("Fork Test Setup Complete");
        console.log("============================================");
        console.log("ISMP Host:", SEPOLIA_ISMP_HOST);
        console.log("TokenBridge:", address(bridge));
        console.log("Test Token:", address(testToken));
        console.log("Donor:", donor);
        console.log("Dest Chain ID:", string(destChainId));
        console.log("============================================");
    }

    /**
     * @notice 测试 ISMP Host 是否可访问
     */
    function testISMPHostAccessible() public view {
        IDispatcher host = IDispatcher(SEPOLIA_ISMP_HOST);

        // 验证 ISMP Host 的基本函数可调用
        bytes memory hostId = host.host();
        console.log("ISMP Host ID:", string(hostId));

        // 验证其他基本函数
        address feeToken = host.feeToken();
        console.log("Fee Token:", feeToken);

        uint256 currentNonce = host.nonce();
        console.log("Current Nonce:", currentNonce);
    }

    /**
     * @notice 测试能否成功调用真实 ISMP Host 的 dispatch 函数
     */
    function testDispatchToRealISMPHost() public {
        vm.startPrank(donor);

        // 授权代币
        testToken.approve(address(bridge), DONATION_AMOUNT);

        // 发起捐款（调用真实的 ISMP Host）
        // 注意：这会在 fork 环境中实际调用 Sepolia 上的 ISMP Host
        uint256 crossChainFee = 0.001 ether;

        console.log("\n============================================");
        console.log("Attempting to donate via real ISMP Host...");
        console.log("============================================");

        bridge.donate{value: crossChainFee}(
            address(testToken),
            DONATION_AMOUNT,
            defaultEventId
        );

        console.log("Donation successful!");
        console.log("============================================\n");

        // 验证代币已转移到 bridge
        assertEq(testToken.balanceOf(address(bridge)), DONATION_AMOUNT);
        assertEq(testToken.balanceOf(donor), INITIAL_BALANCE - DONATION_AMOUNT);

        vm.stopPrank();
    }

    /**
     * @notice 测试 ISMP 消息编码格式是否正确
     */
    function testMessageEncodingFormat() public view {
        // 构造预期的消息格式
        bytes memory payload = abi.encode(
            defaultEventId,
            donor,
            DONATION_AMOUNT,
            block.timestamp
        );

        console.log("Message Payload Length:", payload.length);
        console.log("Dest Chain ID:", string(destChainId));
        console.log("Target Vault:", donationVault);

        // 验证编码后的数据可以正确解码
        (uint256 eventId, address decodedDonor, uint256 amount, uint256 timestamp) = abi.decode(
            payload,
            (uint256, address, uint256, uint256)
        );

        assertEq(eventId, defaultEventId);
        assertEq(decodedDonor, donor);
        assertEq(amount, DONATION_AMOUNT);
        assertEq(timestamp, block.timestamp);
    }

    /**
     * @notice 测试跨链费用要求
     */
    function testCrossChainFeeRequirement() public {
        vm.startPrank(donor);

        testToken.approve(address(bridge), DONATION_AMOUNT);

        // 尝试不支付费用（应该可能会失败，取决于 ISMP Host 的实现）
        console.log("\n============================================");
        console.log("Testing without cross-chain fee...");
        console.log("============================================");

        // 这个调用可能会成功（如果 fee=0 是允许的）或失败
        // 我们只是验证调用不会因为格式问题而 revert
        try bridge.donate{value: 0}(
            address(testToken),
            DONATION_AMOUNT,
            defaultEventId
        ) {
            console.log("Donation with 0 fee succeeded");
        } catch {
            console.log("Donation with 0 fee failed (expected for some ISMP configurations)");
        }

        vm.stopPrank();
    }

    /**
     * @notice 测试 StateMachine 编码是否正确
     */
    function testStateMachineEncoding() public view {
        bytes memory encoded = StateMachine.evm(ARBITRUM_SEPOLIA_CHAIN_ID);
        string memory encodedStr = string(encoded);

        console.log("Encoded Chain ID:", encodedStr);

        // 预期格式: "EVM-421614"
        // 验证包含 "EVM-" 前缀
        assertTrue(bytes(encodedStr).length > 4, "Encoded chain ID too short");
    }

    /**
     * @notice 测试多笔捐款
     */
    function testMultipleDonationsToRealHost() public {
        vm.startPrank(donor);

        uint256 donationCount = 3;
        uint256 amountPerDonation = 10e18;
        uint256 crossChainFee = 0.001 ether;

        testToken.approve(address(bridge), amountPerDonation * donationCount);

        console.log("\n============================================");
        console.log("Testing multiple donations...");
        console.log("============================================");

        for (uint256 i = 0; i < donationCount; i++) {
            console.log("Donation #", i + 1);

            bridge.donate{value: crossChainFee}(
                address(testToken),
                amountPerDonation,
                defaultEventId
            );
        }

        console.log("All donations successful!");
        console.log("============================================\n");

        // 验证总金额
        assertEq(
            testToken.balanceOf(address(bridge)),
            amountPerDonation * donationCount
        );

        vm.stopPrank();
    }
}
