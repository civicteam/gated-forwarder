// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./GatedForwarder.sol";
import "forge-std/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GatedForwarderFactory is Ownable {
    address public implementationAddress;
    address[] public proxies;

    event ContractCreated(address proxy);

    constructor(address newImplementationAddress) {
        implementationAddress = newImplementationAddress;
    }

    function setImplementationAddress(
        address newImplementationAddress
    ) external onlyOwner {
        implementationAddress = newImplementationAddress;
    }

    function getSalt(
        address gatewayTokenContract,
        uint256 gatekeeperNetwork
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(gatewayTokenContract, gatekeeperNetwork));
    }

    function createContract(
        address gatewayTokenContract,
        uint256 gatekeeperNetwork,
        address owner,
        address[] calldata trustedForwarders
    ) external returns (address) {
        bytes32 salt = getSalt(gatewayTokenContract, gatekeeperNetwork);
        // deploy a minimal proxy contract
        address proxy = Clones.cloneDeterministic(implementationAddress, salt);
        GatedForwarder(proxy).initialize(
            gatewayTokenContract,
            gatekeeperNetwork,
            owner,
            trustedForwarders
        );

        proxies.push(proxy);

        emit ContractCreated(proxy);
        return proxy;
    }

    /**
        * @dev Returns the address of the implementation given a particular salt
        * @return The address of the implementation.
        */
    function getContractAddress(
        address gatewayTokenContract,
        uint256 gatekeeperNetwork,
        address deployer
    ) external view returns (address) {
        bytes32 salt = getSalt(gatewayTokenContract, gatekeeperNetwork);
        return Clones.predictDeterministicAddress(implementationAddress, salt, deployer);
    }
}
