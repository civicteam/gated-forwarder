import { Interface } from "ethers";

import { ABI } from './abi';
import { deriveGatedForwarderAddressForPassType } from "./util";
import { TransactionLike } from "ethers";
import gknConfig from './ethereumGatekeeperNetworks.json'

type GKN = keyof typeof gknConfig['prod'];
type GatedTransaction = TransactionLike & {
    to: string,
    data: string
};

/**
 * Wrap a transaction in a gated forwarder transaction, which checks that the sender has a pass of the given type.
 * @param transaction
 * @param passType
 */
export const gate = (transaction: TransactionLike, passType: GKN) : GatedTransaction => {
    const slotId = parseInt(gknConfig['prod'][passType]['gatekeeperNetwork'], 10);
    const gatedForwarderAddress = deriveGatedForwarderAddressForPassType(BigInt(slotId));
    const gatedForwarderInterface = new Interface(ABI.GatedForwarder);

    const newData = gatedForwarderInterface.encodeFunctionData('execute', [[
        transaction.to,
        transaction.data
    ]]);

    return {
        ...transaction,
        data: newData,
        to: gatedForwarderAddress
    }
}