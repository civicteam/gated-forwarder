// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "@gateway/contracts/GatewayToken.sol";
import "@gateway/contracts/FlagsStorage.sol";
import "@gateway/contracts/library/Charge.sol";
import "@gateway/contracts/GatedERC2771.sol";
import "@openzeppelin/contracts/metatx/MinimalForwarder.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

import "../src/GatedForwarderFactory.sol";
import "../src/GatedForwarder.sol";
import "./utils/TargetContract.sol";
import "./utils/SigUtils.sol";
import "./utils/GatewayUtils.sol";
import "./utils/ForwardUtils.sol";

contract GatedForwarderTest is Test, GatewayUtils, ForwardUtils {
    event Success(uint x);

    SigUtils internal sigUtils;

    MinimalForwarder public erc712Forwarder;
    TargetContract public targetContract;
    address public gatedForwarderAddress;

    GatewayToken public gatewayToken;

    address public admin;
    address public userWithPass;
    address public userWithoutPass;
    address public gatekeeper;
    address public relayer;

    uint256 internal userWithPassPrivateKey;
    uint256 internal userWithoutPassPrivateKey;
    uint256 internal relayerPrivateKey;


    function setUp() public {
        string memory mnemonic = "test test test test test test test test test test test junk";
        relayerPrivateKey = vm.deriveKey(mnemonic, 0);
        userWithPassPrivateKey = vm.deriveKey(mnemonic, 1);
        userWithoutPassPrivateKey = vm.deriveKey(mnemonic, 2);

        admin = vm.addr(1);
        userWithPass = vm.addr(userWithPassPrivateKey);
        userWithoutPass = vm.addr(userWithoutPassPrivateKey);
        gatekeeper = vm.addr(4);
        relayer = vm.addr(relayerPrivateKey);

        Charge memory nullCharge = makeNullCharge();

        address flagsStorageProxy = deployFlagsStorage(admin);
        address gatewayTokenProxy = deployGatewayToken(admin, flagsStorageProxy);

        gatewayToken = GatewayToken(gatewayTokenProxy);

        erc712Forwarder = new MinimalForwarder();

        address[] memory trustedForwarders = new address[](1);
        trustedForwarders[0] = address(erc712Forwarder);

        GatedForwarder gatedForwarderImpl = new GatedForwarder();
        GatedForwarderFactory factory = new GatedForwarderFactory(address(gatedForwarderImpl));
        gatedForwarderAddress = factory.createContract(address(gatewayTokenProxy), 0, admin, trustedForwarders);
//        gatedForwarder = new GatedForwarder(address(gatewayToken), 0);
//        gatedForwarder.addForwarder(address(erc712Forwarder));

        targetContract = new TargetContract(gatedForwarderAddress);

        createGatekeeperNetwork(gatewayToken, 0, gatekeeper);

//        gatewayToken.createNetwork(0, "TEST", false, address(0));
//        gatewayToken.addGatekeeper(address(gatekeeper), 0);

        vm.prank(gatekeeper);
        gatewayToken.mint(userWithPass, 0, 0, 0, nullCharge);

        sigUtils = new SigUtils("MinimalForwarder", "0.0.1", address(erc712Forwarder));
    }

    function testAllowWithPass() public {
        bytes memory targetData = abi.encodeWithSelector(
            TargetContract(address(0)).testGated.selector,
            1
        );

        MinimalForwarder.ForwardRequest memory request;
        bytes memory signature;
        (request, signature) = createForwardedRequest(
            address(erc712Forwarder),
            gatedForwarderAddress,
            address(targetContract),
            targetData,
            // This user has a pass
            userWithPass,
            userWithPassPrivateKey
        );

        vm.expectEmit(address(targetContract));
        emit Success(1);

        vm.prank(relayer);
        erc712Forwarder.execute(request, signature);
    }

    function testDisallowWithoutPass() public {
        bytes memory targetData = abi.encodeWithSelector(
            TargetContract(address(0)).testGated.selector,
            1
        );

        MinimalForwarder.ForwardRequest memory request;
        bytes memory signature;
        (request, signature) = createForwardedRequest(
            address(erc712Forwarder),
            gatedForwarderAddress,
            address(targetContract),
            targetData,
            // This user has no pass
            userWithoutPass,
            userWithoutPassPrivateKey
        );

        vm.prank(relayer);

        bool success;
        bytes memory result;
        (success, result) = erc712Forwarder.execute(request, signature);

        // The tx does not reverse in this case because the minimal forwarder swallows the revert and just returns false
        assertFalse(success);
    }
}
