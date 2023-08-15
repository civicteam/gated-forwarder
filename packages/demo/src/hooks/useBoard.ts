import {paginatedIndexesConfig, useBlockNumber, useContractInfiniteReads} from "wagmi";
import {boardContractConfig} from "../components/contracts";
import {useBoardGetPost} from "./useBoardGetPost";
import {useBoardGetPostCount} from "./useBoardGetPostCount";

export const useBoard = () => {
    // used to trigger reloads
    const { data: blockNumber } = useBlockNumber();
    const count = useBoardGetPostCount();
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
            enabled: !!count,
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
                { start: Number(count || 0n), perPage: 4, direction: 'decrement' },
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