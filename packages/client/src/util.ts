import {getCreate2Address, keccak256} from "ethers";
import {GATED_FORWARDER_FACTORY, GATED_FORWARDER_IMPLEMENTATION, GATEWAY_TOKEN_CONTRACT} from "./constants";

const stripHexPrefix = (str: string): string => {
    if (str.startsWith("0x")) {
        return str.slice(2);
    }
    return str;
}

const getSalt = (gatekeeperNetwork: bigint): string => {
    const gatekeeperNetworkAs32Bytes = gatekeeperNetwork.toString(16).padStart(64, "0");
    return keccak256(GATEWAY_TOKEN_CONTRACT + gatekeeperNetworkAs32Bytes);
}

/**
 * Calculate the address of a GatedForwarder contract from the implementation address, the gatekeeper network and
 * the deploying factory.
 * Derived from an implementation of Clones.predictDeterministicAddress in solidity, taken from:
 * https://forum.openzeppelin.com/t/how-to-write-off-chain-method-for-predictdeterministicaddress-in-clones-sol/28883/2
 * @param implementationAddress
 * @param gatekeeperNetwork
 * @param from
 */
const predictDeterministicAddress = (implementationAddress: string, gatekeeperNetwork: bigint, from: string): string => {
    const salt = getSalt(gatekeeperNetwork);
    const implementation = stripHexPrefix(implementationAddress.toLowerCase()).padStart(40, "0");
    const initCode = `0x3d602d80600a3d3981f3363d3d373d3d3d363d73${implementation}5af43d82803e903d91602b57fd5bf3`;
    const initCodeHash = keccak256(initCode);

    return getCreate2Address(from, salt, initCodeHash);
}

export const deriveGatedForwarderAddressForPassType = (passType: bigint) : string =>
    predictDeterministicAddress(GATED_FORWARDER_IMPLEMENTATION, passType, GATED_FORWARDER_FACTORY)

