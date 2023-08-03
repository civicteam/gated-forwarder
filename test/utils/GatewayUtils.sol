// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@gateway/contracts/GatewayToken.sol";
import "@gateway/contracts/FlagsStorage.sol";
import "@gateway/contracts/library/Charge.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract GatewayUtils {
    function makeNullCharge() public pure returns(Charge memory) {
        return Charge({
            value: 0,
            chargeType: ChargeType.NONE,
            token: address(0),
            tokenSender: address(0),
            recipient: address(0)
        });
    }

    function deployFlagsStorage(address admin) public returns(address){
        FlagsStorage flagsStorageImpl = new FlagsStorage();
        bytes memory initFlagsStorage = abi.encodeWithSelector(
            FlagsStorage(address(0)).initialize.selector,
            admin
        );
        ERC1967Proxy flagsStorageProxy = new ERC1967Proxy(address(flagsStorageImpl), initFlagsStorage);
        return address(flagsStorageProxy);
    }

    function deployGatewayToken(address admin, address flagsStorage) public returns(address) {
        GatewayToken gatewayTokenImpl = new GatewayToken();
        bytes memory initGatewayToken = abi.encodeWithSelector(
            GatewayToken(address(0)).initialize.selector,
            "Test",
            "TEST",
            admin,
            address(flagsStorage),
            new address[](0)
        );

        ERC1967Proxy proxy = new ERC1967Proxy(address(gatewayTokenImpl), initGatewayToken);
        return address(proxy);
    }

    function createGatekeeperNetwork(GatewayToken gatewayToken, uint256 slotId, address gatekeeper) public {
        gatewayToken.createNetwork(slotId, "TEST", false, address(0));
        gatewayToken.addGatekeeper(gatekeeper, slotId);
    }
}