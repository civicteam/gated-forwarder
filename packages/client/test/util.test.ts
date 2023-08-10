import {describe, it, expect} from "vitest";
import {deriveGatedForwarderAddressForPassType} from "../src/util";

describe("deriveGatedForwarderAddressForPassType", () => {
    it("should predict the same address as the contract", () => {
        /**
         * Calculated through running the forge scripts on a local anvil instance
         * (assuming the correct deployer private key is set up in the env file)
         * ```
         * source .env
         *
         * anvil &
         * ANVIL_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
         * # Anvil's accounts have money, the deployer doesn't, so send it some
         * cast send $DEPLOYER --private-key $ANVIL_PRIVATE_KEY --value 1ether
         * forge script script/DeployFactory.sol --rpc-url ${LOCAL_RPC_URL} --broadcast
         * forge script script/DeployForwarder.sol --rpc-url ${LOCAL_RPC_URL} --broadcast \
         *      --sig "run(address factoryAddress, uint256 gatekeeperNetwork)" \
         *      0x0d053626Ca75237cD1708F10266Ccbe4903Df0BD 1
         * ```
         * NOTE: This private key is output from Anvil and should not be used in production.
         */

        const expectedAddress = "0x3026038c5dD889e0345FEa827EF1CaA321771e4c";

        const calculatedAddress = deriveGatedForwarderAddressForPassType(1n);
        expect(calculatedAddress).to.equal(expectedAddress);
    });
});