import {describe, it, expect} from "vitest";
import {deriveGatedForwarderAddressForPassType} from "../src/util";

describe("deriveGatedForwarderAddressForPassType", () => {
    it("should predict the same address as the contract", () => {
        /**
         * Calculated through running the forge scripts on a local anvil instance
         * ```
         * export PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
         * forge script script/DeployFactory.sol --rpc-url ${LOCAL_RPC_URL} --broadcast
         * forge script script/DeployForwarder.sol --rpc-url ${LOCAL_RPC_URL} --broadcast \
         *      --sig "run(address factoryAddress, uint256 gatekeeperNetwork)" \
         *      0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 1
         * ```
         * NOTE: This private key is output from Anvil and is should not be used in production.
         */

        const expectedAddress = "0x3343c16170A3068D88723F1269f554B9D4E1d6e1";

        const calculatedAddress = deriveGatedForwarderAddressForPassType(1);
        expect(calculatedAddress).to.equal(expectedAddress);
    });
});