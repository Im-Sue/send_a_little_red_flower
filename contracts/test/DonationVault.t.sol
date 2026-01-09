// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {DonationVault} from "../src/DonationVault.sol";
import {MockISMPHost} from "./mocks/MockISMPHost.sol";

contract DonationVaultTest is Test {
    DonationVault public vault;
    MockISMPHost public ismpHost;

    address public owner = address(this);
    address public donor1 = address(0x1);
    address public donor2 = address(0x2);
    address public beneficiary = address(0x3);

    uint256 public constant FLOWER_RATIO = 100;

    // 事件声明（用于测试）
    event EventCreated(uint256 indexed eventId, string title, uint256 targetAmount);
    event DonationReceived(uint256 indexed eventId, address indexed donor, uint256 amount, uint256 flowers);
    event FundsWithdrawn(uint256 indexed eventId, address indexed beneficiary, uint256 amount);

    function setUp() public {
        // 部署 MockISMPHost
        ismpHost = new MockISMPHost();

        // 部署 DonationVault
        vault = new DonationVault(address(ismpHost));
    }

    // ========== 测试事件创建功能 ==========

    function testCreateEvent() public {
        string memory title = "Help Little Ming";
        string memory description = "Medical assistance needed";
        uint256 targetAmount = 10000e18;
        uint256 deadline = block.timestamp + 30 days;

        vm.expectEmit(true, false, false, true);
        emit EventCreated(1, title, targetAmount);

        uint256 eventId = vault.createEvent(
            title,
            description,
            targetAmount,
            deadline,
            beneficiary
        );

        assertEq(eventId, 1, "Event ID should be 1");
        assertEq(vault.eventCount(), 1, "Event count should be 1");

        // 验证事件数据
        DonationVault.DonationEvent memory evt = vault.getEvent(eventId);
        assertEq(evt.title, title);
        assertEq(evt.description, description);
        assertEq(evt.targetAmount, targetAmount);
        assertEq(evt.currentAmount, 0);
        assertEq(evt.deadline, deadline);
        assertEq(evt.beneficiary, beneficiary);
        assertTrue(evt.isActive);
    }

    function testCreateEventWithInvalidDeadline() public {
        vm.expectRevert("Invalid deadline");
        vault.createEvent(
            "Test Event",
            "Description",
            1000e18,
            block.timestamp - 1, // 过去的时间
            beneficiary
        );
    }

    function testCreateEventWithZeroTarget() public {
        vm.expectRevert("Invalid target");
        vault.createEvent(
            "Test Event",
            "Description",
            0, // 目标金额为0
            block.timestamp + 30 days,
            beneficiary
        );
    }

    function testCreateEventWithInvalidBeneficiary() public {
        vm.expectRevert("Invalid beneficiary");
        vault.createEvent(
            "Test Event",
            "Description",
            1000e18,
            block.timestamp + 30 days,
            address(0) // 无效地址
        );
    }

    function testOnlyOwnerCanCreateEvent() public {
        vm.prank(donor1);
        vm.expectRevert();
        vault.createEvent(
            "Test Event",
            "Description",
            1000e18,
            block.timestamp + 30 days,
            beneficiary
        );
    }

    // ========== 测试捐款接收和小红花铸造 ==========

    function testReceiveDonation() public {
        // 先创建事件
        uint256 eventId = vault.createEvent(
            "Test Event",
            "Description",
            10000e18,
            block.timestamp + 30 days,
            beneficiary
        );

        uint256 donationAmount = 100e18;
        uint256 expectedFlowers = donationAmount * FLOWER_RATIO;

        vm.expectEmit(true, true, false, true);
        emit DonationReceived(eventId, donor1, donationAmount, expectedFlowers);

        vault.receiveDonation(eventId, donor1, donationAmount);

        // 验证捐款记录
        DonationVault.DonationEvent memory evt = vault.getEvent(eventId);
        assertEq(evt.currentAmount, donationAmount, "Current amount should match");

        // 验证小红花余额
        assertEq(vault.balanceOf(donor1), expectedFlowers, "Flower balance should match");
        assertEq(vault.getDonorFlowers(donor1), expectedFlowers, "getDonorFlowers should match");

        // 验证捐赠者累计金额
        assertEq(vault.donorTotalAmount(donor1), donationAmount, "Total amount should match");
    }

    function testMultipleDonations() public {
        uint256 eventId = vault.createEvent(
            "Test Event",
            "Description",
            10000e18,
            block.timestamp + 30 days,
            beneficiary
        );

        // 第一笔捐款
        vault.receiveDonation(eventId, donor1, 100e18);
        assertEq(vault.balanceOf(donor1), 100e18 * FLOWER_RATIO);

        // 第二笔捐款
        vault.receiveDonation(eventId, donor1, 50e18);
        assertEq(vault.balanceOf(donor1), 150e18 * FLOWER_RATIO);
        assertEq(vault.donorTotalAmount(donor1), 150e18);

        // 不同捐赠者
        vault.receiveDonation(eventId, donor2, 200e18);
        assertEq(vault.balanceOf(donor2), 200e18 * FLOWER_RATIO);

        // 验证事件总额
        DonationVault.DonationEvent memory evt = vault.getEvent(eventId);
        assertEq(evt.currentAmount, 350e18);
    }

    function testReceiveDonationToInactiveEvent() public {
        uint256 eventId = vault.createEvent(
            "Test Event",
            "Description",
            10000e18,
            block.timestamp + 30 days,
            beneficiary
        );

        // 先捐一次正常的
        vault.receiveDonation(eventId, donor1, 100e18);

        // 提取资金后事件变为不活跃
        vm.warp(block.timestamp + 31 days);
        vault.withdraw(eventId);

        // 尝试再次捐款应该失败
        vm.expectRevert("Event not active");
        vault.receiveDonation(eventId, donor1, 50e18);
    }

    function testReceiveDonationAfterDeadline() public {
        uint256 eventId = vault.createEvent(
            "Test Event",
            "Description",
            10000e18,
            block.timestamp + 30 days,
            beneficiary
        );

        // 时间快进到截止日期后
        vm.warp(block.timestamp + 31 days);

        vm.expectRevert("Event ended");
        vault.receiveDonation(eventId, donor1, 100e18);
    }

    function testReceiveDonationWithZeroAmount() public {
        uint256 eventId = vault.createEvent(
            "Test Event",
            "Description",
            10000e18,
            block.timestamp + 30 days,
            beneficiary
        );

        vm.expectRevert("Invalid amount");
        vault.receiveDonation(eventId, donor1, 0);
    }

    // ========== 测试查询功能 ==========

    function testGetEventDonations() public {
        uint256 eventId = vault.createEvent(
            "Test Event",
            "Description",
            10000e18,
            block.timestamp + 30 days,
            beneficiary
        );

        vault.receiveDonation(eventId, donor1, 100e18);
        vault.receiveDonation(eventId, donor2, 200e18);
        vault.receiveDonation(eventId, donor1, 50e18);

        DonationVault.Donation[] memory donations = vault.getEventDonations(eventId);
        assertEq(donations.length, 3, "Should have 3 donations");

        // 验证第一笔捐款
        assertEq(donations[0].donor, donor1);
        assertEq(donations[0].amount, 100e18);
        assertEq(donations[0].flowersReceived, 100e18 * FLOWER_RATIO);

        // 验证第二笔捐款
        assertEq(donations[1].donor, donor2);
        assertEq(donations[1].amount, 200e18);

        // 验证第三笔捐款
        assertEq(donations[2].donor, donor1);
        assertEq(donations[2].amount, 50e18);
    }

    // ========== 测试资金提取功能 ==========

    function testWithdraw() public {
        uint256 eventId = vault.createEvent(
            "Test Event",
            "Description",
            10000e18,
            block.timestamp + 30 days,
            beneficiary
        );

        vault.receiveDonation(eventId, donor1, 500e18);

        // 时间快进到截止日期后
        vm.warp(block.timestamp + 31 days);

        vm.expectEmit(true, true, false, true);
        emit FundsWithdrawn(eventId, beneficiary, 500e18);

        vault.withdraw(eventId);

        // 验证事件状态
        DonationVault.DonationEvent memory evt = vault.getEvent(eventId);
        assertEq(evt.currentAmount, 0, "Amount should be 0 after withdrawal");
        assertFalse(evt.isActive, "Event should be inactive");
    }

    function testWithdrawBeforeDeadline() public {
        uint256 eventId = vault.createEvent(
            "Test Event",
            "Description",
            10000e18,
            block.timestamp + 30 days,
            beneficiary
        );

        vault.receiveDonation(eventId, donor1, 500e18);

        vm.expectRevert("Event not ended");
        vault.withdraw(eventId);
    }

    function testWithdrawWithNoFunds() public {
        uint256 eventId = vault.createEvent(
            "Test Event",
            "Description",
            10000e18,
            block.timestamp + 30 days,
            beneficiary
        );

        vm.warp(block.timestamp + 31 days);

        vm.expectRevert("No funds");
        vault.withdraw(eventId);
    }

    function testOnlyOwnerCanWithdraw() public {
        uint256 eventId = vault.createEvent(
            "Test Event",
            "Description",
            10000e18,
            block.timestamp + 30 days,
            beneficiary
        );

        vault.receiveDonation(eventId, donor1, 500e18);
        vm.warp(block.timestamp + 31 days);

        vm.prank(donor1);
        vm.expectRevert();
        vault.withdraw(eventId);
    }

    // ========== 测试 ERC20 功能 ==========

    function testTokenMetadata() public {
        assertEq(vault.name(), "RedFlower");
        assertEq(vault.symbol(), "FLOWER");
        assertEq(vault.decimals(), 18);
    }

    function testTransferFlowers() public {
        uint256 eventId = vault.createEvent(
            "Test Event",
            "Description",
            10000e18,
            block.timestamp + 30 days,
            beneficiary
        );

        vault.receiveDonation(eventId, donor1, 100e18);

        uint256 flowers = vault.balanceOf(donor1);

        // donor1 转账给 donor2
        vm.prank(donor1);
        vault.transfer(donor2, flowers / 2);

        assertEq(vault.balanceOf(donor1), flowers / 2);
        assertEq(vault.balanceOf(donor2), flowers / 2);
    }

    // ========== 综合场景测试 ==========

    function testCompleteFlow() public {
        // 1. 创建事件
        uint256 eventId = vault.createEvent(
            "Help Little Ming",
            "Medical assistance needed",
            1000e18,
            block.timestamp + 30 days,
            beneficiary
        );

        // 2. 多个捐赠者捐款
        vault.receiveDonation(eventId, donor1, 300e18);
        vault.receiveDonation(eventId, donor2, 500e18);
        vault.receiveDonation(eventId, donor1, 200e18);

        // 3. 验证事件进度
        DonationVault.DonationEvent memory evt = vault.getEvent(eventId);
        assertEq(evt.currentAmount, 1000e18);
        assertTrue(evt.isActive);

        // 4. 验证小红花分配
        assertEq(vault.balanceOf(donor1), 500e18 * FLOWER_RATIO);
        assertEq(vault.balanceOf(donor2), 500e18 * FLOWER_RATIO);

        // 5. 验证捐款记录
        DonationVault.Donation[] memory donations = vault.getEventDonations(eventId);
        assertEq(donations.length, 3);

        // 6. 时间到期后提取
        vm.warp(block.timestamp + 31 days);
        vault.withdraw(eventId);

        // 7. 验证最终状态
        evt = vault.getEvent(eventId);
        assertEq(evt.currentAmount, 0);
        assertFalse(evt.isActive);
    }
}
