pragma solidity ^0.8.4;

import "forge-std/Script.sol";
import "../src/GatedForwarderFactory.sol";
import "../src/GatedForwarder.sol";

contract DeployFactory is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        GatedForwarder implementation = new GatedForwarder();
        GatedForwarderFactory factory = new GatedForwarderFactory(address(implementation));

        console.log("GatedForwarderFactory.createContract: implementation=%s", address(implementation));
        console.log("GatedForwarderFactory.createContract: factory=%s", address(factory));

        vm.stopBroadcast();
    }
}
