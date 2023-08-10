import {useContractWrite, useWaitForTransaction} from "wagmi";
import {useGelatoWagmi} from "../hooks/useGelato";

export const responseFromWagmiOrGelato = (
    gelato: boolean,
    wagmiWriteResult: ReturnType<typeof useContractWrite>,
    waitForTransactionResult: ReturnType<typeof useWaitForTransaction>,
    gelatoWriteResult: ReturnType<typeof useGelatoWagmi>,
) => {
    return {
        write: gelato ? gelatoWriteResult.submit : wagmiWriteResult.write,
        txHash: gelato ? gelatoWriteResult?.txHash : waitForTransactionResult?.data?.transactionHash,
        isPending: gelato ? gelatoWriteResult?.loading : waitForTransactionResult?.isLoading,
        isSuccess: gelato ? gelatoWriteResult?.taskStatus?.taskState === "ExecSuccess" : waitForTransactionResult?.isSuccess,
        error: gelato ? gelatoWriteResult?.error : waitForTransactionResult?.error,
    }
}