// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/GatedForwarder.sol";
import "@gateway/contracts/GatewayToken.sol";

contract GatedForwarderTest is Test {
    GatedForwarder public forwarder;
    address public admin;

    function setUp() public {
        admin = vm.addr(1);

        gatewayToken = new GatewayToken();
        gatewayToken.initialize("Test", "TEST", admin, "0x00000000000000000000000000000000", address[](0));
        forwarder = new GatedForwarder();
    }

    function testIncrement() public {
    }

    function testSetNumber(uint256 x) public {
    }
}
