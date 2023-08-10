import {describe, it, expect} from "vitest";
import {gate} from "../src";
import {BaseContract, Contract} from "ethers";
import {deriveGatedForwarderAddressForPassType} from "../src/util";

const DUMMY_CONTRACT_ADDRESS = "0x1Ab2FCfee2bAEBdDb5bF632fc80A715B08E20cFd"
const TRANSFER_RECIPIENT = "0x4bb5a188e0387F99F32c0c91Ac8235c75FaFb864"
const ERC20_MINI_ABI = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

describe("gate", () => {
    it("should wrap a transaction in a gated transaction", async () => {
        const passType = 1n;

        const erc20Contract = BaseContract.from(DUMMY_CONTRACT_ADDRESS, ERC20_MINI_ABI);
        const transferTx = await erc20Contract.transfer.populateTransaction(TRANSFER_RECIPIENT, 100);
        const gatedTx = gate(transferTx, passType);

        const expectedGatedForwarderContract = deriveGatedForwarderAddressForPassType(passType)

        // some fields are retained from the original transfer
        expect(gatedTx.from).to.equal(transferTx.from);
        // other fields are overwritten
        expect(gatedTx.to).to.equal(expectedGatedForwarderContract);
        // The data payload passed to the gated contract contains the original transfer data and the original to address
        expect(gatedTx.data).to.contain(DUMMY_CONTRACT_ADDRESS.slice(2).toLowerCase());
        expect(gatedTx.data).to.contain(transferTx.data.slice(2));
    });
});