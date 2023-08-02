// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/metatx/MinimalForwarder.sol";

contract SigUtils {
    address _target;
    bytes32 _hashedName;
    bytes32 _hashedVersion;

    constructor(string memory eip712Name, string memory eip712Version, address target) {
        _target = target;
        _hashedName = keccak256(bytes(eip712Name));
        _hashedVersion = keccak256(bytes(eip712Version));
    }

    bytes32 private constant _TYPEHASH =
    keccak256("ForwardRequest(address from,address to,uint256 value,uint256 gas,uint256 nonce,bytes data)");

    bytes32 private constant _DOMAIN_SEPARATOR_TYPEHASH =
    keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");


    // computes the hash of the fully encoded EIP-712 message for the domain, which can be used to recover the signer
    function getTypedDataHash(MinimalForwarder.ForwardRequest memory req) external view returns (bytes32) {
        return _hashTypedDataV4(
            getStructHash(req)
        );
    }

    function _hashTypedDataV4(bytes32 structHash) internal view virtual returns (bytes32) {
        return ECDSA.toTypedDataHash(_buildDomainSeparatorForTarget(), structHash);
    }

    function _buildDomainSeparatorForTarget() private view returns (bytes32) {
        return keccak256(abi.encode(_DOMAIN_SEPARATOR_TYPEHASH, _hashedName, _hashedVersion, block.chainid, _target));
    }

    // computes the hash of a forward request
    function getStructHash(MinimalForwarder.ForwardRequest memory _forwardRequest)
    internal
    pure
    returns (bytes32)
    {
        return
            keccak256(
            abi.encode(
                _TYPEHASH,
                _forwardRequest.from,
                _forwardRequest.to,
                _forwardRequest.value,
                _forwardRequest.gas,
                _forwardRequest.nonce,
                keccak256(_forwardRequest.data)
            )
        );
    }
}
