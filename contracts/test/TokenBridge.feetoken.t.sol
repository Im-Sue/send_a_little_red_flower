// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {TokenBridge} from "../src/TokenBridge.sol";
import {MockERC20} from "./mocks/MockERC20.sol";
import {IDispatcher, StateMachine} from "../src/interfaces/IISMPCore.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title TokenBridgeFeeTokenTest
 * @notice Fork 测试 - 验证使用 feeToken (USD.h) 支付跨链费用
 *
 * 运行方式：
 * forge test --fork-url $SEPOLIA_RPC_URL --match-contract TokenBridgeFeeTokenTest -vvv
 */
contract TokenBridgeFeeTokenTest is Test {
    TokenBridge public bridge;
    MockERC20 public testToken;

    // 真实的 Sepolia 地址（从 Hyperbridge 文档获取）
    address constant SEPOLIA_ISMP_HOST = 0x2EdB74C269948b60ec1000040E104cef0eABaae8;
    address constant TOKEN_FAUCET = 0x1794aB22388303ce9Cb798bE966eeEBeFe59C3a3;
    address constant FEE_TOKEN = 0xA801da100bF16D07F668F4A49E1f71fc54D05177; // USD.h

    // 测试参数
    address public donationVault = address(0x1234567890123456789012345678901234567890);
    bytes public destChainId;
    uint256 public defaultEventId = 1;

    address public donor = address(0xABCD);
    uint256 public constant DONATION_AMOUNT = 100e18;

    function setUp() public {
        // 生成目标链标识
        destChainId = StateMachine.evm(421614); // Arbitrum Sepolia

        // 部署 TokenBridge
        bridge = new TokenBridge(
            SEPOLIA_ISMP_HOST,
            donationVault,
            destChainId,
            defaultEventId
        );

        // 部署测试代币
        testToken = new MockERC20("Test Token", "TEST");
        testToken.mint(donor, 10000e18);

        console.log("============================================");
        console.log("Fork Test Setup Complete");
        console.log("============================================");
        console.log("TokenBridge:", address(bridge));
        console.log("FeeToken (USD.h):", FEE_TOKEN);
        console.log("TokenFaucet:", TOKEN_FAUCET);
        console.log("============================================");
    }

    /**
     * @notice 测试：从 TokenFaucet 获取 USD.h
     */
    function testDripFeeToken() public {
        console.log("\n[Test] Drip USD.h from TokenFaucet");

        uint256 balanceBefore = IERC20(FEE_TOKEN).balanceOf(address(this));
        console.log("Balance before:", balanceBefore);

        // 调用 TokenFaucet.drip() 获取 USD.h
        (bool success, ) = TOKEN_FAUCET.call(
            abi.encodeWithSignature("drip(address)", FEE_TOKEN)
        );

        require(success, "TokenFaucet drip failed");

        uint256 balanceAfter = IERC20(FEE_TOKEN).balanceOf(address(this));
        console.log("Balance after:", balanceAfter);
        console.log("Received:", balanceAfter - balanceBefore);

        assertTrue(balanceAfter > balanceBefore, "Should receive USD.h");
    }

    /**
     * @notice 测试：给 TokenBridge 充值 USD.h
     */
    function testFundTokenBridge() public {
        // 先获取 USD.h
        (bool success, ) = TOKEN_FAUCET.call(
            abi.encodeWithSignature("drip(address)", FEE_TOKEN)
        );
        require(success, "Drip failed");

        uint256 fundAmount = 500e18;
        uint256 bridgeBalanceBefore = IERC20(FEE_TOKEN).balanceOf(address(bridge));

        console.log("\n[Test] Fund TokenBridge with USD.h");
        console.log("Bridge balance before:", bridgeBalanceBefore);

        // 转 USD.h 给 TokenBridge
        IERC20(FEE_TOKEN).transfer(address(bridge), fundAmount);

        uint256 bridgeBalanceAfter = IERC20(FEE_TOKEN).balanceOf(address(bridge));
        console.log("Bridge balance after:", bridgeBalanceAfter);
        console.log("Funded:", fundAmount);

        assertEq(bridgeBalanceAfter, bridgeBalanceBefore + fundAmount);
    }

    /**
     * @notice 测试：使用 fundFeeToken 函数充值
     */
    function testFundFeeTokenFunction() public {
        // 先获取 USD.h
        (bool success, ) = TOKEN_FAUCET.call(
            abi.encodeWithSignature("drip(address)", FEE_TOKEN)
        );
        require(success, "Drip failed");

        uint256 fundAmount = 300e18;

        console.log("\n[Test] Use fundFeeToken() to fund bridge");

        // 授权 TokenBridge
        IERC20(FEE_TOKEN).approve(address(bridge), fundAmount);

        uint256 bridgeBalanceBefore = bridge.getFeeTokenBalance();
        console.log("Bridge USD.h balance before:", bridgeBalanceBefore);

        // 使用 fundFeeToken 函数
        bridge.fundFeeToken(fundAmount);

        uint256 bridgeBalanceAfter = bridge.getFeeTokenBalance();
        console.log("Bridge USD.h balance after:", bridgeBalanceAfter);

        assertEq(bridgeBalanceAfter, bridgeBalanceBefore + fundAmount);
    }

    /**
     * @notice 测试：完整的捐款流程（使用 feeToken）
     */
    function testCompleteDonationWithFeeToken() public {
        console.log("\n[Test] Complete donation flow with feeToken");

        // 1. 获取 USD.h
        (bool success, ) = TOKEN_FAUCET.call(
            abi.encodeWithSignature("drip(address)", FEE_TOKEN)
        );
        require(success, "Drip failed");
        console.log("Step 1: Received USD.h from faucet");

        // 2. 给 TokenBridge 充值 USD.h
        uint256 fundAmount = 500e18;
        IERC20(FEE_TOKEN).transfer(address(bridge), fundAmount);
        console.log("Step 2: Funded bridge with", fundAmount, "USD.h");

        // 3. 准备捐款
        vm.startPrank(donor);
        testToken.approve(address(bridge), DONATION_AMOUNT);
        console.log("Step 3: Donor approved test token");

        // 4. 发起捐款（不带 msg.value）
        uint256 usdBalanceBefore = bridge.getFeeTokenBalance();
        console.log("Step 4: Bridge USD.h before donation:", usdBalanceBefore);

        bridge.donate(address(testToken), DONATION_AMOUNT);
        console.log("Step 5: Donation dispatched successfully!");

        uint256 usdBalanceAfter = bridge.getFeeTokenBalance();
        console.log("Step 6: Bridge USD.h after donation:", usdBalanceAfter);
        console.log("USD.h spent:", usdBalanceBefore - usdBalanceAfter);

        vm.stopPrank();

        // 验证代币已转入 bridge
        assertEq(testToken.balanceOf(address(bridge)), DONATION_AMOUNT);

        // 验证 USD.h 已被扣除（支付了跨链费用）
        assertTrue(usdBalanceAfter < usdBalanceBefore, "USD.h should be deducted");
    }

    /**
     * @notice 测试：验证 approve 在构造函数中生效
     */
    function testFeeTokenApproval() public {
        console.log("\n[Test] Verify feeToken approval");

        // 检查 TokenBridge 是否已经授权了 ISMP Host
        uint256 allowance = IERC20(FEE_TOKEN).allowance(
            address(bridge),
            SEPOLIA_ISMP_HOST
        );

        console.log("Bridge allowance to ISMP Host:", allowance);

        // 应该是 type(uint256).max
        assertEq(allowance, type(uint256).max, "Should approve max amount");
    }

    /**
     * @notice 测试：没有 USD.h 余额时应该失败
     */
    function testDonationFailsWithoutFeeToken() public {
        console.log("\n[Test] Donation should fail without USD.h balance");

        // 不给 bridge 充值 USD.h
        vm.startPrank(donor);
        testToken.approve(address(bridge), DONATION_AMOUNT);

        // 尝试捐款应该失败（余额不足支付费用）
        vm.expectRevert();
        bridge.donate(address(testToken), DONATION_AMOUNT);

        vm.stopPrank();

        console.log("Donation correctly failed without USD.h balance");
    }

    /**
     * @notice 测试：查询费用估算
     */
    function testEstimateFee() public view {
        console.log("\n[Test] Estimate cross-chain fee");

        // 查询每字节费用
        bytes memory dest = StateMachine.evm(421614);
        uint256 perByteFee = IDispatcher(SEPOLIA_ISMP_HOST).perByteFee(dest);

        console.log("Per byte fee:", perByteFee);

        // 估算消息大小（eventId + donor + amount + timestamp）
        // uint256 + address + uint256 + uint256 = 32 + 32 + 32 + 32 = 128 bytes
        uint256 estimatedBodySize = 128;
        uint256 estimatedFee = estimatedBodySize * perByteFee;

        console.log("Estimated body size:", estimatedBodySize, "bytes");
        console.log("Estimated protocol fee:", estimatedFee, "USD.h");
    }
}
