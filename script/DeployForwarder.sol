pragma solidity ^0.8.4;

import "forge-std/Script.sol";
import "../src/GatedForwarderFactory.sol";
import "../src/GatedForwarder.sol";

contract DeployFactory is Script {
    address public constant GATEWAY_TOKEN = 0xF65b6396dF6B7e2D8a6270E3AB6c7BB08BAEF22E;

    function setUp() public {}

    function run(address factoryAddress, uint256 gatekeeperNetwork) public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        address admin = vm.addr(deployerPrivateKey);
        address[] memory trustedForwarders = new address[](1);

        GatedForwarderFactory factory = GatedForwarderFactory(factoryAddress);

        address gatedForwarderAddress = factory.createContract(address(GATEWAY_TOKEN), gatekeeperNetwork, admin, trustedForwarders);

        console.log("GatedForwarderFactory.createContract: factory=%s", address(factory));
        console.log("GatedForwarderFactory.createContract: gatedForwarderAddress=%s", gatedForwarderAddress);

        vm.stopBroadcast();
    }
}
