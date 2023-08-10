import {
    paginatedIndexesConfig,
    useContractInfiniteReads,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction
} from "wagmi";
import {boardContractConfig} from "../components/contracts";
import {useState} from "react";
import {useDebounce} from "./useDebounce";
import {useGelatoWagmi} from "./useGelato";
import {responseFromWagmiOrGelato} from "../utils/gelato";
import {useRelayerContext} from "../context/RelayerContext";

type Input = { content?: string }

export const useBoardCreatePost = ({ content }: Input) => {
    const { gelatoEnabled } = useRelayerContext();
    const debouncedContent = useDebounce(content)

    const { config } = usePrepareContractWrite({
        ...boardContractConfig,
        functionName: 'createPost',
        enabled: !!debouncedContent,
        args: [debouncedContent ?? ''],
    })
    const wagmiWriteResult = useContractWrite(config)
    const waitForTransactionResult = useWaitForTransaction({ hash: wagmiWriteResult?.data?.hash })
    const gelatoWriteResult = useGelatoWagmi(config)

    return responseFromWagmiOrGelato(gelatoEnabled, wagmiWriteResult, waitForTransactionResult, gelatoWriteResult);
}