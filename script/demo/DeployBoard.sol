pragma solidity ^0.8.4;

import "forge-std/Script.sol";
import "../../src/demo/Board.sol";

contract DeployFactory is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        Board board = new Board();

        console.log("Board: %s", address(board));

        vm.stopBroadcast();
    }
}
