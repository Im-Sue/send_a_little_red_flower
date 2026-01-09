// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Simplified ISMP interfaces for MVP - only POST request functionality

struct StateMachineHeight {
    uint256 stateMachineId;
    uint256 height;
}

struct PostRequest {
    bytes source;
    bytes dest;
    uint64 nonce;
    bytes from;
    bytes to;
    uint64 timeoutTimestamp;
    bytes body;
}

struct PostResponse {
    PostRequest request;
    bytes response;
    uint64 timeoutTimestamp;
}

struct IncomingPostRequest {
    PostRequest request;
    address relayer;
}

struct IncomingPostResponse {
    PostResponse response;
    address relayer;
}

enum FrozenStatus {
    None,
    Incoming,
    Outgoing,
    All
}

struct DispatchPost {
    bytes dest;
    bytes to;
    bytes body;
    uint64 timeout;
    uint256 fee;
    address payer;
}

interface IDispatcher {
    function host() external view returns (bytes memory);
    function hyperbridge() external view returns (bytes memory);
    function frozen() external view returns (FrozenStatus);
    function uniswapV2Router() external view returns (address);
    function nonce() external view returns (uint256);
    function feeToken() external view returns (address);
    function perByteFee(bytes memory dest) external view returns (uint256);
    function dispatch(DispatchPost memory request) external payable returns (bytes32 commitment);
    function fundRequest(bytes32 commitment, uint256 amount) external payable;
}

interface IIsmpModule {
    function onAccept(IncomingPostRequest memory incoming) external;
    function onPostResponse(IncomingPostResponse memory incoming) external;
    function onPostRequestTimeout(PostRequest memory request) external;
    function onPostResponseTimeout(PostResponse memory request) external;
}

abstract contract BaseIsmpModule is IIsmpModule {
    error UnexpectedCall();
    error UnauthorizedCall();

    modifier onlyHost() {
        if (msg.sender != host()) revert UnauthorizedCall();
        _;
    }

    function host() public view virtual returns (address);

    function onAccept(IncomingPostRequest calldata) external virtual onlyHost {
        revert UnexpectedCall();
    }

    function onPostRequestTimeout(PostRequest memory) external virtual onlyHost {
        revert UnexpectedCall();
    }

    function onPostResponse(IncomingPostResponse memory) external virtual onlyHost {
        revert UnexpectedCall();
    }

    function onPostResponseTimeout(PostResponse memory) external virtual onlyHost {
        revert UnexpectedCall();
    }
}

library StateMachine {
    uint256 public constant RELAY_CHAIN = 0;

    function polkadot(uint256 id) internal pure returns (bytes memory) {
        return bytes(string.concat("POLKADOT-", _toString(id)));
    }

    function kusama(uint256 id) internal pure returns (bytes memory) {
        return bytes(string.concat("KUSAMA-", _toString(id)));
    }

    function evm(uint chainid) internal pure returns (bytes memory) {
        return bytes(string.concat("EVM-", _toString(chainid)));
    }

    function substrate(bytes4 id) internal pure returns (bytes memory) {
        return bytes(string.concat("SUBSTRATE-", string(abi.encodePacked(id))));
    }

    function tendermint(bytes4 id) internal pure returns (bytes memory) {
        return bytes(string.concat("TNDRMINT-", string(abi.encodePacked(id))));
    }

    // Simple uint to string conversion
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}
