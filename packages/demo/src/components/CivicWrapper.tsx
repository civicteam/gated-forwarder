import {GatewayProvider} from "@civic/ethereum-gateway-react";
import {useEthersSignerProvider} from "../hooks/useEthers";
import {FC, PropsWithChildren} from "react";
import {Wallet} from "@ethersproject/wallet";
import { gate } from "@civic/gelato-client";
import {CallWithERC2771Request} from "@gelatonetwork/relay-sdk";
import { hexlify } from "@ethersproject/bytes";

const GATEKEEPER_NETWORK= "ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6";

export const CivicWrapper: FC<PropsWithChildren> = ({ children }) => {
    const ethersProvider = useEthersSignerProvider()
    const wallet = ethersProvider?.getSigner() as unknown as Wallet;

    return (
        <GatewayProvider wallet={wallet} gatekeeperNetwork={GATEKEEPER_NETWORK}>
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

    console.log({
        gatedTx,
        tx
    });

    return {
        ...request,
        target: gatedTx.to,
        data: gatedTx.data
    }
}