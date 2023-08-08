pragma solidity ^0.8.4;

import "forge-std/Script.sol";
import "../src/GatedForwarderFactory.sol";
import "../src/GatedForwarder.sol";

contract DeployFactory is Script {
    address public constant GATEWAY_TOKEN = 0xF65b6396dF6B7e2D8a6270E3AB6c7BB08BAEF22E;

    function setUp() public {}

    function run(address trustedForwarder, address gatedForwarderAddress) public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        GatedForwarder forwarder = GatedForwarder(gatedForwarderAddress);
        forwarder.addForwarder(trustedForwarder);

        vm.stopBroadcast();
    }
}
