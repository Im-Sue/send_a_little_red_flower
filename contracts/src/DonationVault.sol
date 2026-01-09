// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {BaseIsmpModule, IncomingPostRequest} from "./interfaces/IISMPCore.sol";

/**
 * @title DonationVault
 * @notice 捐款金库合约 - 接收跨链捐款并发放小红花代币
 * @dev 部署在目标链 (Arbitrum Sepolia), 继承 BaseIsmpModule 以接收跨链消息
 */
contract DonationVault is ERC20, Ownable, ReentrancyGuard, BaseIsmpModule {

    // ISMP Host 合约地址 (不可变)
    address private immutable _ismpHost;

    // 1 USDT = 100 小红花
    uint256 public constant FLOWER_RATIO = 100;

    // 捐助事件结构
    struct DonationEvent {
        string title;           // 事件标题
        string description;     // 事件描述
        uint256 targetAmount;   // 目标金额
        uint256 currentAmount;  // 当前已筹金额
        uint256 deadline;       // 截止时间
        address beneficiary;    // 受助方地址
        bool isActive;          // 是否活跃
    }

    // 捐款记录结构
    struct Donation {
        address donor;          // 捐赠者地址
        uint256 amount;         // 捐款金额
        uint256 timestamp;      // 捐款时间
        uint256 flowersReceived; // 获得的小红花数量
    }

    // 状态变量
    uint256 public eventCount;
    mapping(uint256 => DonationEvent) public events;
    mapping(uint256 => Donation[]) public eventDonations;
    mapping(address => uint256) public donorTotalAmount;

    // 事件
    event EventCreated(uint256 indexed eventId, string title, uint256 targetAmount);
    event DonationReceived(uint256 indexed eventId, address indexed donor, uint256 amount, uint256 flowers);
    event FundsWithdrawn(uint256 indexed eventId, address indexed beneficiary, uint256 amount);

    /**
     * @notice 构造函数
     * @param _host ISMP Host 合约地址
     */
    constructor(address _host) ERC20("RedFlower", "FLOWER") Ownable(msg.sender) {
        require(_host != address(0), "Invalid ISMP host");
        _ismpHost = _host;
    }

    /**
     * @notice 返回 ISMP Host 合约地址
     * @dev BaseIsmpModule 要求实现此函数
     */
    function host() public view override returns (address) {
        return _ismpHost;
    }

    /**
     * @notice 创建捐助事件
     * @param title 事件标题
     * @param description 事件描述
     * @param targetAmount 目标金额
     * @param deadline 截止时间
     * @param beneficiary 受助方地址
     * @return eventId 事件ID
     */
    function createEvent(
        string calldata title,
        string calldata description,
        uint256 targetAmount,
        uint256 deadline,
        address beneficiary
    ) external onlyOwner returns (uint256 eventId) {
        require(deadline > block.timestamp, "Invalid deadline");
        require(targetAmount > 0, "Invalid target");
        require(beneficiary != address(0), "Invalid beneficiary");

        eventId = ++eventCount;
        events[eventId] = DonationEvent({
            title: title,
            description: description,
            targetAmount: targetAmount,
            currentAmount: 0,
            deadline: deadline,
            beneficiary: beneficiary,
            isActive: true
        });

        emit EventCreated(eventId, title, targetAmount);
    }

    /**
     * @notice 接收跨链捐款（由 ISMP Host 调用）
     * @dev 实现 BaseIsmpModule 的 onAccept 回调
     * @param incoming 跨链消息
     */
    function onAccept(IncomingPostRequest memory incoming) external override onlyHost {
        // 解码消息内容
        (uint256 eventId, address donor, uint256 amount, uint256 timestamp) = abi.decode(
            incoming.request.body,
            (uint256, address, uint256, uint256)
        );

        // 处理捐款
        _receiveDonation(eventId, donor, amount);
    }

    /**
     * @notice 内部函数：处理捐款逻辑
     * @param eventId 事件ID
     * @param donor 捐赠者地址
     * @param amount 捐款金额
     */
    function _receiveDonation(
        uint256 eventId,
        address donor,
        uint256 amount
    ) internal nonReentrant {
        DonationEvent storage evt = events[eventId];
        require(evt.isActive, "Event not active");
        require(block.timestamp < evt.deadline, "Event ended");
        require(amount > 0, "Invalid amount");

        // 更新事件和捐赠者数据
        evt.currentAmount += amount;
        donorTotalAmount[donor] += amount;

        // 铸造小红花
        uint256 flowers = amount * FLOWER_RATIO;
        _mint(donor, flowers);

        // 记录捐款
        eventDonations[eventId].push(Donation({
            donor: donor,
            amount: amount,
            timestamp: block.timestamp,
            flowersReceived: flowers
        }));

        emit DonationReceived(eventId, donor, amount, flowers);
    }

    /**
     * @notice 接收捐款（供测试使用）
     * @dev 生产环境应该禁用此函数，仅通过 onAccept 接收跨链消息
     * @param eventId 事件ID
     * @param donor 捐赠者地址
     * @param amount 捐款金额
     */
    function receiveDonation(
        uint256 eventId,
        address donor,
        uint256 amount
    ) external {
        // TODO: 生产环境应删除此函数或添加严格的权限控制
        _receiveDonation(eventId, donor, amount);
    }

    /**
     * @notice 管理员提取资金
     * @param eventId 事件ID
     */
    function withdraw(uint256 eventId) external onlyOwner nonReentrant {
        DonationEvent storage evt = events[eventId];
        require(block.timestamp >= evt.deadline, "Event not ended");
        require(evt.currentAmount > 0, "No funds");

        uint256 amount = evt.currentAmount;
        evt.currentAmount = 0;
        evt.isActive = false;

        // TODO: 转账给受助方
        // IERC20(donationToken).transfer(evt.beneficiary, amount);

        emit FundsWithdrawn(eventId, evt.beneficiary, amount);
    }

    /**
     * @notice 查询事件的所有捐款记录
     * @param eventId 事件ID
     * @return 捐款记录数组
     */
    function getEventDonations(uint256 eventId) external view returns (Donation[] memory) {
        return eventDonations[eventId];
    }

    /**
     * @notice 查询用户的小红花余额
     * @param donor 捐赠者地址
     * @return 小红花余额
     */
    function getDonorFlowers(address donor) external view returns (uint256) {
        return balanceOf(donor);
    }

    /**
     * @notice 查询事件信息
     * @param eventId 事件ID
     * @return 事件详细信息
     */
    function getEvent(uint256 eventId) external view returns (DonationEvent memory) {
        return events[eventId];
    }
}
