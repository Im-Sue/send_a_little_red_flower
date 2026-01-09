// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IDispatcher, DispatchPost, FrozenStatus} from "../../src/interfaces/IISMPCore.sol";

/**
 * @title MockISMPHost
 * @notice Mock implementation of IDispatcher for testing
 */
contract MockISMPHost is IDispatcher {

    bytes32 public lastCommitment;
    DispatchPost public lastPost;

    function host() external pure override returns (bytes memory) {
        return bytes("EVM-11155111"); // Ethereum Sepolia
    }

    function hyperbridge() external pure override returns (bytes memory) {
        return bytes("HYPERBRIDGE");
    }

    function frozen() external pure override returns (FrozenStatus) {
        return FrozenStatus.None;
    }

    function uniswapV2Router() external pure override returns (address) {
        return address(0);
    }

    function nonce() external pure override returns (uint256) {
        return 1;
    }

    function feeToken() external pure override returns (address) {
        return address(0xA801da100bF16D07F668F4A49E1f71fc54D05177); // USD.h
    }

    function perByteFee(bytes memory) external pure override returns (uint256) {
        return 0;
    }

    function dispatch(DispatchPost memory request) external payable override returns (bytes32 commitment) {
        lastPost = request;
        commitment = keccak256(abi.encode(request.dest, request.to, request.body, block.timestamp));
        lastCommitment = commitment;
        return commitment;
    }

    function fundRequest(bytes32, uint256) external payable override {
        revert("Not implemented");
    }
}
