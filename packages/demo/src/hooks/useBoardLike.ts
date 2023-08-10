import {
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction
} from "wagmi";
import {boardContractConfig} from "../components/contracts";
import {useDebounce} from "./useDebounce";
import {useRelayerContext} from "../context/RelayerContext";
import {useGelatoWagmi} from "./useGelato";
import {responseFromWagmiOrGelato} from "../utils/gelato";

type Input = { postId?: bigint }

export const useBoardLike = ({ postId }: Input) => {
    const { gelatoEnabled } = useRelayerContext();
    const debouncedPostId = useDebounce(postId)

    const { config } = usePrepareContractWrite({
        ...boardContractConfig,
        functionName: 'likePost',
        enabled: debouncedPostId !== undefined,
        args: [debouncedPostId || 0n],
    })
    const wagmiWriteResult = useContractWrite(config)
    const waitForTransactionResult = useWaitForTransaction({ hash: wagmiWriteResult?.data?.hash })
    const gelatoWriteResult = useGelatoWagmi(config)

    return responseFromWagmiOrGelato(gelatoEnabled, wagmiWriteResult, waitForTransactionResult, gelatoWriteResult);
}