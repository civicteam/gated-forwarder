import {paginatedIndexesConfig, useBlockNumber, useContractInfiniteReads} from "wagmi";
import {boardContractConfig} from "../components/contracts";
import {useBoardGetPost} from "./useBoardGetPost";

export const useBoard = () => {
    // used to trigger reloads
    const { data: blockNumber } = useBlockNumber();
    const {
        data: posts,
        isLoading: isLoadingPosts,
        isSuccess: isSuccessLoadingBoards,
        error: errorLoadingBoards,
        fetchNextPage: fetchNextBoardsPage,
        fetchStatus,
        hasNextPage
    } =
        useContractInfiniteReads({
            cacheKey: 'posts',
            blockNumber,
            ...paginatedIndexesConfig(
                (index: number) =>
                    [
                        {
                            ...boardContractConfig,
                            functionName: 'getPost',
                            args: [BigInt(index)] as const,
                        },
                        {
                            ...boardContractConfig,
                            functionName: 'getLikesByPostId',
                            args: [BigInt(index)] as const,
                        },
                    ],
                { start: 0, perPage: 4, direction: 'increment' },
            ),
        })

    return {
        posts,
        isLoadingPosts,
        isSuccessLoadingBoards,
        errorLoadingBoards,
        fetchNextBoardsPage,
        fetchStatus,
        hasNextPage
    }
}