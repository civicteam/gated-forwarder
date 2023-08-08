// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@gateway/contracts/GatedERC2771Upgradeable.sol";
import "@gateway/contracts/MultiERC2771ContextUpgradeable.sol";

contract GatedForwarder is GatedERC2771Upgradeable, OwnableUpgradeable, ReentrancyGuard {
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

    function initialize(
        address gatewayTokenContract,
        uint256 gatekeeperNetwork,
        address owner,
        address[] calldata trustedForwarders
    ) external initializer {
        __GatedERC2771Upgradeable_init(gatewayTokenContract, gatekeeperNetwork, trustedForwarders);
        // initialize ownership of the forwarder to the deploying factory, and transfer to the owner
        __Ownable_init();
        transferOwnership(owner);
    }

    function execute(ForwardRequest calldata req) external payable gated nonReentrant returns (bool, bytes memory) {
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
        override(MultiERC2771ContextUpgradeable, ContextUpgradeable)
        returns (address sender)
    {
        return MultiERC2771ContextUpgradeable._msgSender();
    }

    function _msgData()
        internal
        view
        virtual
        override(MultiERC2771ContextUpgradeable, ContextUpgradeable)
        returns (bytes calldata)
    {
        return MultiERC2771ContextUpgradeable._msgData();
    }
}
