import {paginatedIndexesConfig, useContractInfiniteReads, useContractRead} from "wagmi";
import {boardContractConfig} from "../components/contracts";

export const useBoardGetPost = (index: bigint) => {
    const { data  } =
        useContractRead({
            ...boardContractConfig,
            functionName: 'getPost',
            args: [index] as const,
        })

    return {
        data
    }
}