// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";

contract TargetContract is ERC2771Context {
    event Success(uint256 x);

    constructor(address forwarder) ERC2771Context(forwarder) {}

    function testGated(uint256 x) external {
        emit Success(x);
    }
}
