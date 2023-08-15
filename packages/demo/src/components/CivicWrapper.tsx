import {GatewayProvider} from "@civic/ethereum-gateway-react";
import {useEthersSignerProvider} from "../hooks/useEthers";
import {FC, PropsWithChildren, useCallback, useEffect, useState} from "react";
import {gate} from "@civic/gelato-client";
import {CallWithERC2771Request} from "@gelatonetwork/relay-sdk";
import {hexlify} from "@ethersproject/bytes";
import {TransactionRequest, TransactionResponse} from "@ethersproject/providers";
import {Wallet} from "@ethersproject/wallet";
import {useAccount, useChainId} from "wagmi";
import {useGelato} from "../hooks/useGelato";

const GATEKEEPER_NETWORK= "ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6";

export const CivicWrapper: FC<PropsWithChildren> = ({ children }) => {
    const { submitSponsored, txHash, error, loading } = useGelato({});
    const [txResponseCallbacks, setTxResponseCallbacks] = useState<((txResponse: TransactionResponse) => void)[]>([]);

    const ethersProvider = useEthersSignerProvider()
    const { address } = useAccount();
    const wallet = ethersProvider?.getSigner() as unknown as Wallet;
    const chainId = useChainId();

    console.log({
        txHash,
        error,
        loading,
        txResponseCallbacks,
    })

    useEffect(() => {
        if (!txHash) return;

        txResponseCallbacks.forEach(cb => {
            console.log("resolving tx response: ", txHash);
            cb({ hash: txHash } as TransactionResponse);
        })
    }, [txHash]);

    // const handleTransaction = useCallback(async (tx: TransactionRequest) => {
    //     if (!tx.data) throw new Error("No data");
    //     if (!tx.to) throw new Error("No target");
    //     if (!address) throw new Error("No address");
    //     console.log("handling transaction: ", tx);
    //     const request = {
    //         chainId: BigInt(chainId),
    //         data: hexlify(tx.data),
    //         target: tx.to
    //     };
    //     console.log("submitting request: ", request)
    //     submitSponsored(request);
    //
    //     return new Promise<TransactionResponse>(resolve => {
    //         setTxResponseCallbacks(cbs => ([...cbs, resolve]))
    //     });
    // }, [address, chainId]);

    return (
        <GatewayProvider
            wallet={wallet}
            gatekeeperNetwork={GATEKEEPER_NETWORK}
            // handleTransaction={handleTransaction}
        >
                {children}
        </GatewayProvider>
    )
}

export const useCivicGate = (request: CallWithERC2771Request | undefined): CallWithERC2771Request | undefined => {
    if (!request) return undefined;

    const data = hexlify(request.data)

    const tx = {
        to: request.target,
        data,
        value: 0, // TODO: support value
        from: request.user,
    }

    const gatedTx = gate(tx, GATEKEEPER_NETWORK);

    return {
        ...request,
        target: gatedTx.to,
        data: gatedTx.data
    }
}