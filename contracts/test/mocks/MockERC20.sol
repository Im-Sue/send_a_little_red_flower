// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * 
 * @title MockERC20
 * @notice 用于测试的模拟 ERC20 代币
 */
contract MockERC20 is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        // 铸造初始供应量给部署者
        _mint(msg.sender, 1000000 * 10**18);
    }

    /**
     * @notice 允许任何人铸造代币（仅测试用）
     */
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
