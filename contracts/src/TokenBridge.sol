// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IDispatcher, DispatchPost, StateMachine} from "./interfaces/IISMPCore.sol";

/**
 * @title TokenBridge
 * @notice 跨链捐款入口合约
 * @dev 部署在源链 (Ethereum Sepolia)
 */
contract TokenBridge is ReentrancyGuard {

    IDispatcher public immutable ismpHost;    // ISMP Host 合约
    address public immutable donationVault;   // 目标链金库地址
    bytes public destChainId;                 // 目标链标识
    uint256 public defaultEventId;            // 默认捐款事件ID

    // 事件
    event DonationInitiated(
        address indexed donor,
        uint256 amount,
        uint256 indexed eventId,
        bytes32 messageId
    );

    /**
     * @notice 构造函数
     * @param _ismpHost ISMP Host 合约地址
     * @param _donationVault 目标链金库地址
     * @param _destChainId 目标链标识 (例如: StateMachine.evm(421614) for Arbitrum Sepolia)
     * @param _defaultEventId 默认事件ID
     */
    constructor(
        address _ismpHost,
        address _donationVault,
        bytes memory _destChainId,
        uint256 _defaultEventId
    ) {
        require(_ismpHost != address(0), "Invalid ISMP host");
        require(_donationVault != address(0), "Invalid vault address");

        ismpHost = IDispatcher(_ismpHost);
        donationVault = _donationVault;
        destChainId = _destChainId;
        defaultEventId = _defaultEventId;
    }

    /**
     * @notice 发起跨链捐款
     * @param token 捐款代币地址
     * @param amount 捐款金额
     * @param eventId 捐款事件ID
     */
    function donate(
        address token,
        uint256 amount,
        uint256 eventId
    ) external payable nonReentrant {
        _donate(token, amount, eventId);
    }

    /**
     * @notice 使用默认事件ID捐款（简化版）
     * @param token 捐款代币地址
     * @param amount 捐款金额
     */
    function donate(address token, uint256 amount) external payable nonReentrant {
        _donate(token, amount, defaultEventId);
    }

    /**
     * @notice 内部捐款逻辑
     */
    function _donate(
        address token,
        uint256 amount,
        uint256 eventId
    ) internal {
        require(amount > 0, "Amount must be positive");
        require(token != address(0), "Invalid token");

        // Step 1: 从用户转账代币到本合约
        IERC20(token).transferFrom(msg.sender, address(this), amount);

        // Step 2: 打包跨链消息数据
        bytes memory payload = abi.encode(
            eventId,         // 事件ID
            msg.sender,      // 捐赠者地址
            amount,          // 捐款金额
            block.timestamp  // 时间戳
        );

        // Step 3: 准备 ISMP 消息
        DispatchPost memory request = DispatchPost({
            dest: destChainId,                           // 目标链 (Arbitrum Sepolia)
            to: abi.encodePacked(donationVault),        // 目标合约地址
            body: payload,                               // 消息内容
            timeout: 3600,                               // 1小时超时
            fee: 0,                                      // 使用 msg.value 支付费用
            payer: address(this)                         // 本合约支付费用
        });

        // Step 4: 发送跨链消息
        bytes32 messageId = ismpHost.dispatch{value: msg.value}(request);

        emit DonationInitiated(msg.sender, amount, eventId, messageId);
    }

    /**
     * @notice 更新默认事件ID
     * @param newEventId 新的默认事件ID
     */
    function updateDefaultEventId(uint256 newEventId) external {
        // TODO: 添加权限控制
        defaultEventId = newEventId;
    }
}
