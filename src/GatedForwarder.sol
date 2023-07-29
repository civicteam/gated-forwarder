// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "openzeppelin-contracts/contracts/security/ReentrancyGuard.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";
import "@gateway/contracts/GatedERC2771.sol";
import "@gateway/contracts/MultiERC2771Context.sol";
import "./interfaces/IForwarder.sol";

contract GatedForwarder is GatedERC2771, MultiERC2771Context, Ownable {
    event ForwardResult(bool);

    function addForwarder(address forwarder) external onlyOwner {
        _addForwarder(forwarder);
    }

    function removeForwarder(address forwarder) external onlyOwner {
        _removeForwarder(forwarder);
    }

    constructor(
        address gatewayTokenContract,
        uint256 gatekeeperNetwork
    ) GatedERC2771(gatewayTokenContract, gatekeeperNetwork) EIP712("GatedForwarder", "0.0.1") {}

    function execute() gated external payable nonReentrant returns (bool, bytes memory) {
        // TODO is msg.value needed here? Probably the target receives msg.value either way
        (bool success, bytes memory returndata) = req.to.call{value: msg.value}(msg.data);

        // Forward the revert message from the call if the call failed.
        if (success == false) {
            // solhint-disable-next-line no-inline-assembly
            assembly {
                revert(add(returndata, 32), mload(returndata))
            }
        }
        emit ForwardResult(success);

        return (success, returndata);
    }
}
