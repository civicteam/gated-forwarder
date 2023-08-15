// A hook that returns enabled true if
// - the user has a valid civic pass or
// - civic is not enabled
import {useGateway} from "@civic/ethereum-gateway-react";
import {useRelayerContext} from "../context/RelayerContext";
import {GatewayStatus} from "@civic/common-gateway-react/dist/esm/types";

export const useCivicStatus = (): { enabled: boolean } => {
    const { civicEnabled } = useRelayerContext();
    const { gatewayStatus } = useGateway();

    return {
        enabled: !civicEnabled || gatewayStatus === GatewayStatus.ACTIVE
    }
}