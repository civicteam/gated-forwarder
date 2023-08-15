import {
    CallWithERC2771Request,
    GelatoRelay,
    RelayRequestOptions,
    SponsoredCallRequest,
    TransactionStatusResponse
} from "@gelatonetwork/relay-sdk";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useEthersSignerProvider} from "./useEthers";
import {useAccount, useChainId, usePrepareContractWrite} from "wagmi";
import {Abi, Address, encodeFunctionData} from "viem";
import {useRelayerContext} from "../context/RelayerContext";
import {useCivicGate} from "../components/CivicWrapper";

const apiKey = import.meta.env.VITE_GELATO_API_KEY;
const relay = new GelatoRelay();

type Input = {
    gelatoOptions?: RelayRequestOptions,
}
type Output = {
    submit: (request: CallWithERC2771Request) => void,
    submitSponsored: (request: SponsoredCallRequest) => void,
    loading: boolean,
    error: unknown,
    taskStatus: TransactionStatusResponse | undefined,
    taskId: string | undefined,
    txHash: string | undefined
}

type HookOutput = Omit<Output, 'submit'> & { submit: () => void }

type WagmiPreparedTxConfig = ReturnType<typeof usePrepareContractWrite>["config"];

type TaskState = TransactionStatusResponse["taskState"];
const PENDING_STATES = ["CheckPending", "ExecPending", "WaitingForConfirmation"];
const isPending = (taskState: TaskState): boolean => PENDING_STATES.includes(taskState)

export const useGelato = ({ gelatoOptions }: Input): Output => {
    const ethersProvider = useEthersSignerProvider()

    // a hook to submit the transaction to gelato using sponsoredCallERC2771
    const { mutate: submit , isLoading: isSubmitting, error: submitError, data: submitResponse } = useMutation((request: CallWithERC2771Request) => {
        if (!ethersProvider) throw new Error("No ethers provider set");
        if (!apiKey) throw new Error("No API key set");
        return relay.sponsoredCallERC2771(request, ethersProvider, apiKey, gelatoOptions);
    });

    // a hook to submit the transaction to gelato using sponsoredCall
    const { mutate: submitSponsored , isLoading: isSubmittingSponsored, error: submitSponsoredError, data: submitSponsoredResponse } = useMutation((request: SponsoredCallRequest) => {
        if (!ethersProvider) throw new Error("No ethers provider set");
        if (!apiKey) throw new Error("No API key set");
        return relay.sponsoredCall(request, apiKey, gelatoOptions);
    });

    // once the task ID exists, poll gelato for its status
    const { data: taskStatus, error: fetchStatusError } = useQuery({
        queryKey: [submitResponse?.taskId ?? submitSponsoredResponse?.taskId ?? ""],
        queryFn: async () => {
            const taskId = submitResponse?.taskId ?? submitSponsoredResponse?.taskId;
            if (!taskId) throw new Error("No task ID set");
            return relay.getTaskStatus(taskId);
        },
        enabled: !!(submitResponse?.taskId ?? submitSponsoredResponse?.taskId),
        refetchInterval: 1000,
        retry: ():boolean => !!(submitResponse?.taskId ?? submitSponsoredResponse?.taskId) && !!taskStatus && isPending(taskStatus.taskState),
    });

    // console.log({
    //     isSubmitting,
    //     submitError,
    //     submitResponse,
    //     isFetchingStatus,
    //     fetchStatusError,
    //     taskStatus,
    // })

  return {
      submit,
      submitSponsored,
      loading: isSubmitting || isSubmittingSponsored || (!!taskStatus?.taskState && isPending(taskStatus.taskState)),
      error: submitError || fetchStatusError,
      taskStatus,
      taskId: submitResponse?.taskId,
      txHash: taskStatus?.transactionHash
  };
}

const wagmiToRequest = (config?: WagmiPreparedTxConfig, fromAddress?: Address, chainId?: number): CallWithERC2771Request | undefined => {
    if (!config || chainId === undefined || !config.request?.abi || !fromAddress) return undefined;

    const data = encodeFunctionData({
        abi: config.request.abi,
        functionName: config.request.functionName,
        args: config.request.args
    })

    return {
        chainId: BigInt(chainId),
        target: config.request.address,
        data,
        user: fromAddress,
    }
}

export const useGelatoWagmi = (preparedTxConfig?: WagmiPreparedTxConfig, gelatoOptions?: RelayRequestOptions): HookOutput => {
    const { address } = useAccount();
    const chainId = useChainId();
    const request = wagmiToRequest(preparedTxConfig, address, chainId);
    const { civicEnabled } = useRelayerContext();
    const gatedRequest = useCivicGate(request);
    const { submit, submitSponsored, loading, error, taskStatus, taskId, txHash } = useGelato({ gelatoOptions })

    const submitRequest = () => {
        const requestToSubmit = civicEnabled ? gatedRequest : request;
        return requestToSubmit && submit(requestToSubmit);
    }

    return {
        submit: submitRequest,
        submitSponsored,    // not currently using the civic gate
        loading,
        error,
        taskStatus,
        taskId,
        txHash
    }
}