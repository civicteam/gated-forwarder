// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@gateway/contracts/GatedERC2771.sol";
import "@gateway/contracts/MultiERC2771ContextNonUpgradeable.sol";
import "on-chain-identity-gateway/ethereum/smart-contract/contracts/MultiERC2771ContextNonUpgradeable.sol";

contract GatedForwarder is GatedERC2771, Ownable, ReentrancyGuard {
    event ForwardResult(bool);

    struct ForwardRequest {
        address to;
        bytes data;
    }

    function addForwarder(address forwarder) external onlyOwner {
        _addForwarder(forwarder);
    }

    function removeForwarder(address forwarder) external onlyOwner {
        _removeForwarder(forwarder);
    }

    constructor(
        address gatewayTokenContract,
        uint256 gatekeeperNetwork
    ) GatedERC2771(gatewayTokenContract, gatekeeperNetwork) {}

    function execute(ForwardRequest calldata req) gated nonReentrant external payable returns (bool, bytes memory) {
        // TODO is msg.value needed here? Probably the target receives msg.value either way
        (bool success, bytes memory returndata) = req.to.call{value: msg.value}(req.data);

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

    function _msgSender()
    internal
    view
    virtual
    override(MultiERC2771ContextNonUpgradeable, Context)
    returns (address sender)
    {
        return MultiERC2771ContextNonUpgradeable._msgSender();
    }

    function _msgData()
    internal
    view
    virtual
    override(MultiERC2771ContextNonUpgradeable, Context)
    returns (bytes calldata)
    {
        return MultiERC2771ContextNonUpgradeable._msgData();
    }
}
