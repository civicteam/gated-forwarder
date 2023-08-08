// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/metatx/MinimalForwarder.sol";

import "../../src/GatedForwarder.sol";
import "./SigUtils.sol";

contract ForwardUtils is Test {
    function createForwardedRequest(
        address erc712Forwarder,
        address gatedForwarder,
        address targetContract,
        bytes memory encodedData,
        address signer,
        uint256 signerPrivateKey
    ) public returns (MinimalForwarder.ForwardRequest memory request, bytes memory signature) {
        SigUtils sigUtils = new SigUtils("MinimalForwarder", "0.0.1", erc712Forwarder);
        bytes memory data = abi.encodeWithSelector(
            GatedForwarder(address(0)).execute.selector,
            GatedForwarder.ForwardRequest({to: targetContract, data: encodedData})
        );
        MinimalForwarder.ForwardRequest memory forwardRequest = MinimalForwarder.ForwardRequest({
            from: signer,
            to: gatedForwarder,
            value: 0,
            nonce: 0,
            gas: 300000,
            data: data
        });

        bytes32 digest = sigUtils.getTypedDataHash(forwardRequest);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(signerPrivateKey, digest);
        bytes memory sig = abi.encodePacked(r, s, v);

        return (forwardRequest, sig);
    }
}