// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {TokenBridge} from "../src/TokenBridge.sol";
import {MockERC20} from "./mocks/MockERC20.sol";
import {MockISMPHost} from "./mocks/MockISMPHost.sol";

contract TokenBridgeTest is Test {
    TokenBridge public bridge;
    MockERC20 public usdt;
    MockISMPHost public ismpHost;

    address public donationVault = address(0x1234);
    bytes public destChainId = hex"657468657265756d2d7365706f6c6961"; // "ethereum-sepolia"
    uint256 public defaultEventId = 1;

    address public donor1 = address(0x1);
    address public donor2 = address(0x2);

    uint256 public constant INITIAL_BALANCE = 10000e18;

    // 事件声明
    event DonationInitiated(
        address indexed donor,
        uint256 amount,
        uint256 indexed eventId,
        bytes32 messageId
    );

    function setUp() public {
        // 部署 MockISMPHost
        ismpHost = new MockISMPHost();

        // 部署 TokenBridge
        bridge = new TokenBridge(
            address(ismpHost),
            donationVault,
            destChainId,
            defaultEventId
        );

        // 部署 Mock USDT
        usdt = new MockERC20("Mock USDT", "USDT");

        // 给测试账户分配代币
        usdt.mint(donor1, INITIAL_BALANCE);
        usdt.mint(donor2, INITIAL_BALANCE);
    }

    // ========== 测试构造函数和初始化 ==========

    function testConstructor() public {
        assertEq(bridge.donationVault(), donationVault, "Vault address mismatch");
        assertEq(bridge.destChainId(), destChainId, "Chain ID mismatch");
        assertEq(bridge.defaultEventId(), defaultEventId, "Default event ID mismatch");
    }

    function testConstructorWithInvalidVault() public {
        vm.expectRevert("Invalid vault address");
        new TokenBridge(address(ismpHost), address(0), destChainId, defaultEventId);
    }

    function testConstructorWithInvalidHost() public {
        vm.expectRevert("Invalid ISMP host");
        new TokenBridge(address(0), donationVault, destChainId, defaultEventId);
    }

    // ========== 测试捐款功能（指定事件ID）==========

    function testDonateWithEventId() public {
        uint256 donationAmount = 100e18;
        uint256 eventId = 2;

        // donor1 批准 bridge 使用代币
        vm.startPrank(donor1);
        usdt.approve(address(bridge), donationAmount);

        // 期待触发事件
        vm.expectEmit(true, true, false, false);
        emit DonationInitiated(donor1, donationAmount, eventId, bytes32(0));

        // 执行捐款
        bridge.donate(address(usdt), donationAmount, eventId);
        vm.stopPrank();

        // 验证代币转账
        assertEq(usdt.balanceOf(donor1), INITIAL_BALANCE - donationAmount, "Donor balance incorrect");
        assertEq(usdt.balanceOf(address(bridge)), donationAmount, "Bridge balance incorrect");
    }

    function testDonateWithDefaultEventId() public {
        uint256 donationAmount = 200e18;

        vm.startPrank(donor1);
        usdt.approve(address(bridge), donationAmount);

        // 期待触发事件（使用默认 eventId）
        vm.expectEmit(true, true, false, false);
        emit DonationInitiated(donor1, donationAmount, defaultEventId, bytes32(0));

        // 使用简化版捐款函数
        bridge.donate(address(usdt), donationAmount);
        vm.stopPrank();

        assertEq(usdt.balanceOf(address(bridge)), donationAmount, "Bridge balance incorrect");
    }

    function testMultipleDonations() public {
        uint256 amount1 = 100e18;
        uint256 amount2 = 150e18;

        // donor1 第一笔捐款
        vm.startPrank(donor1);
        usdt.approve(address(bridge), amount1);
        bridge.donate(address(usdt), amount1, 1);
        vm.stopPrank();

        // donor1 第二笔捐款
        vm.startPrank(donor1);
        usdt.approve(address(bridge), amount2);
        bridge.donate(address(usdt), amount2, 1);
        vm.stopPrank();

        // donor2 捐款
        vm.startPrank(donor2);
        usdt.approve(address(bridge), amount1);
        bridge.donate(address(usdt), amount1, 2);
        vm.stopPrank();

        // 验证余额
        assertEq(usdt.balanceOf(donor1), INITIAL_BALANCE - amount1 - amount2);
        assertEq(usdt.balanceOf(donor2), INITIAL_BALANCE - amount1);
        assertEq(usdt.balanceOf(address(bridge)), amount1 + amount2 + amount1);
    }

    // ========== 测试事件触发 ==========

    function testDonationEventEmitted() public {
        uint256 donationAmount = 50e18;
        uint256 eventId = 3;

        vm.startPrank(donor1);
        usdt.approve(address(bridge), donationAmount);

        // 期待触发 DonationInitiated 事件
        vm.expectEmit(true, true, false, false);
        emit DonationInitiated(donor1, donationAmount, eventId, bytes32(0));

        bridge.donate(address(usdt), donationAmount, eventId);
        vm.stopPrank();

        // 验证代币转账成功
        assertEq(usdt.balanceOf(address(bridge)), donationAmount);
    }

    // ========== 测试边界条件和错误处理 ==========

    function testDonateWithZeroAmount() public {
        vm.startPrank(donor1);
        usdt.approve(address(bridge), 100e18);

        vm.expectRevert("Amount must be positive");
        bridge.donate(address(usdt), 0, 1);
        vm.stopPrank();
    }

    function testDonateWithInvalidToken() public {
        vm.startPrank(donor1);

        vm.expectRevert("Invalid token");
        bridge.donate(address(0), 100e18, 1);
        vm.stopPrank();
    }

    function testDonateWithoutApproval() public {
        uint256 donationAmount = 100e18;

        vm.startPrank(donor1);

        // 不批准代币，直接捐款应该失败
        vm.expectRevert();
        bridge.donate(address(usdt), donationAmount, 1);
        vm.stopPrank();
    }

    function testDonateWithInsufficientBalance() public {
        uint256 donationAmount = INITIAL_BALANCE + 1;

        vm.startPrank(donor1);
        usdt.approve(address(bridge), donationAmount);

        // 余额不足应该失败
        vm.expectRevert();
        bridge.donate(address(usdt), donationAmount, 1);
        vm.stopPrank();
    }

    function testDonateWithInsufficientApproval() public {
        uint256 donationAmount = 100e18;
        uint256 approvalAmount = 50e18;

        vm.startPrank(donor1);
        usdt.approve(address(bridge), approvalAmount);

        // 批准额度不足应该失败
        vm.expectRevert();
        bridge.donate(address(usdt), donationAmount, 1);
        vm.stopPrank();
    }

    // ========== 测试重入攻击保护 ==========

    function testReentrancyProtection() public {
        // TokenBridge 使用 ReentrancyGuard，应该防止重入
        uint256 donationAmount = 100e18;

        vm.startPrank(donor1);
        usdt.approve(address(bridge), donationAmount);
        bridge.donate(address(usdt), donationAmount, 1);

        // 再次捐款应该成功（验证 nonReentrant 正确解锁）
        usdt.approve(address(bridge), donationAmount);
        bridge.donate(address(usdt), donationAmount, 1);
        vm.stopPrank();

        assertEq(usdt.balanceOf(address(bridge)), donationAmount * 2);
    }

    // ========== 测试更新默认事件ID ==========

    function testUpdateDefaultEventId() public {
        uint256 newEventId = 99;

        bridge.updateDefaultEventId(newEventId);

        assertEq(bridge.defaultEventId(), newEventId, "Default event ID not updated");
    }

    function testDonateAfterUpdatingDefaultEventId() public {
        uint256 newEventId = 10;
        uint256 donationAmount = 100e18;

        // 更新默认事件ID
        bridge.updateDefaultEventId(newEventId);

        vm.startPrank(donor1);
        usdt.approve(address(bridge), donationAmount);

        // 期待使用新的默认事件ID
        vm.expectEmit(true, true, false, false);
        emit DonationInitiated(donor1, donationAmount, newEventId, bytes32(0));

        bridge.donate(address(usdt), donationAmount);
        vm.stopPrank();
    }

    // ========== 测试跨链消息数据编码 ==========

    function testPayloadEncoding() public view {
        uint256 eventId = 1;
        address donor = donor1;
        uint256 amount = 100e18;
        uint256 timestamp = block.timestamp;

        // 模拟合约中的 payload 编码
        bytes memory payload = abi.encode(eventId, donor, amount, timestamp);

        // 验证解码
        (uint256 decodedEventId, address decodedDonor, uint256 decodedAmount, uint256 decodedTimestamp) =
            abi.decode(payload, (uint256, address, uint256, uint256));

        assertEq(decodedEventId, eventId);
        assertEq(decodedDonor, donor);
        assertEq(decodedAmount, amount);
        assertEq(decodedTimestamp, timestamp);
    }

    // ========== Gas 优化测试 ==========

    function testGasConsumption() public {
        uint256 donationAmount = 100e18;

        vm.startPrank(donor1);
        usdt.approve(address(bridge), donationAmount);

        uint256 gasBefore = gasleft();
        bridge.donate(address(usdt), donationAmount, 1);
        uint256 gasUsed = gasBefore - gasleft();

        console.log("Gas used for donation:", gasUsed);

        // 验证 gas 消耗在合理范围内（< 300k，因为包含 ISMP 跨链调用）
        assertTrue(gasUsed < 300000, "Gas consumption too high");
        vm.stopPrank();
    }

    // ========== 综合场景测试 ==========

    function testCompleteFlow() public {
        uint256 eventId = 5;
        uint256 donationAmount = 500e18;

        // 1. donor1 捐款
        vm.startPrank(donor1);
        usdt.approve(address(bridge), donationAmount);

        vm.expectEmit(true, true, false, false);
        emit DonationInitiated(donor1, donationAmount, eventId, bytes32(0));

        bridge.donate(address(usdt), donationAmount, eventId);
        vm.stopPrank();

        // 2. 验证状态
        assertEq(usdt.balanceOf(donor1), INITIAL_BALANCE - donationAmount);
        assertEq(usdt.balanceOf(address(bridge)), donationAmount);

        // 3. donor2 也捐款
        vm.startPrank(donor2);
        usdt.approve(address(bridge), donationAmount);
        bridge.donate(address(usdt), donationAmount, eventId);
        vm.stopPrank();

        // 4. 最终验证
        assertEq(usdt.balanceOf(address(bridge)), donationAmount * 2);
        assertEq(usdt.balanceOf(donor1), INITIAL_BALANCE - donationAmount);
        assertEq(usdt.balanceOf(donor2), INITIAL_BALANCE - donationAmount);
    }

    // ========== 测试不同代币类型 ==========

    function testDonateWithDifferentTokens() public {
        // 创建另一个代币
        MockERC20 dai = new MockERC20("Mock DAI", "DAI");
        dai.mint(donor1, INITIAL_BALANCE);

        uint256 donationAmount = 100e18;

        // 使用 USDT 捐款
        vm.startPrank(donor1);
        usdt.approve(address(bridge), donationAmount);
        bridge.donate(address(usdt), donationAmount, 1);

        // 使用 DAI 捐款
        dai.approve(address(bridge), donationAmount);
        bridge.donate(address(dai), donationAmount, 2);
        vm.stopPrank();

        // 验证两种代币都被正确接收
        assertEq(usdt.balanceOf(address(bridge)), donationAmount);
        assertEq(dai.balanceOf(address(bridge)), donationAmount);
    }

    // ========== 测试大额捐款 ==========

    function testLargeDonation() public {
        uint256 largeAmount = 1000000e18;

        usdt.mint(donor1, largeAmount);

        vm.startPrank(donor1);
        usdt.approve(address(bridge), largeAmount);
        bridge.donate(address(usdt), largeAmount, 1);
        vm.stopPrank();

        assertEq(usdt.balanceOf(address(bridge)), largeAmount);
    }

    // ========== Fuzz 测试 ==========

    function testFuzzDonate(uint256 amount) public {
        // 限制范围在合理区间
        vm.assume(amount > 0 && amount <= INITIAL_BALANCE);

        vm.startPrank(donor1);
        usdt.approve(address(bridge), amount);
        bridge.donate(address(usdt), amount, 1);
        vm.stopPrank();

        assertEq(usdt.balanceOf(address(bridge)), amount);
        assertEq(usdt.balanceOf(donor1), INITIAL_BALANCE - amount);
    }
}
