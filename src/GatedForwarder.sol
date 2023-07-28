// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {EIP712} from "openzeppelin-contracts/contracts/utils/cryptography/EIP712.sol";
import {ReentrancyGuard} from "openzeppelin-contracts/contracts/security/ReentrancyGuard.sol";
import {Address} from "openzeppelin-contracts/contracts/utils/Address.sol";
import {IForwarder} from "./interfaces/IForwarder.sol";

contract GatedForwarder {
    using Address for address payable;

    bytes32 private constant _TYPEHASH =
    keccak256("ForwardRequest(address from,address to,uint256 value,uint256 gas,uint256 nonce,bytes data)");

    event ForwardResult(bool);

    constructor() EIP712("GatedForwarder", "0.0.1") {}

    function execute(
        ForwardRequest calldata req,
        bytes calldata signature
    ) external payable nonReentrant returns (bool, bytes memory) {
        (bool success, bytes memory returndata) = req.to.call{gas: req.gas, value: req.value}(
            abi.encodePacked(req.data, req.from)
        );

        // Forward the revert message from the call if the call failed.
        if (success == false) {
            // solhint-disable-next-line no-inline-assembly
            assembly {
                revert(add(returndata, 32), mload(returndata))
            }
        }

        // Validate that the relayer has sent enough gas for the call.
        // See https://ronan.eth.limo/blog/ethereum-gas-dangers/
        if (gasleft() <= req.gas / 64) {
            // We explicitly trigger invalid opcode to consume all gas and bubble-up the effects, since
            // neither revert or assert consume all gas since Solidity 0.8.0
            // https://docs.soliditylang.org/en/v0.8.0/control-structures.html#panic-via-assert-and-error-via-require
            // solhint-disable-next-line no-inline-assembly
            assembly {
                invalid()
            }
        }
        emit ForwardResult(success);

        return (success, returndata);
    }
}
