import {Like, Post} from "../utils/types";
import {createContext, FC, PropsWithChildren, useContext, useEffect, useState} from "react";
import {useBoard} from "../hooks/useBoard";

type BoardContextType = {
    posts: Post[],
    fetchNextBoardsPage: () => void,
    error: Error | null
}

const BoardContext = createContext<BoardContextType>({
    posts: [],
    fetchNextBoardsPage: () => {},
    error: null
});

type PostResponse = ReturnType<typeof useBoard>['posts']
type NotUndefined<T> = T extends undefined ? never : T;
type SuccessResult<T> = T extends { status: "success", result: infer U } ? U : never;
type PostResultValue = SuccessResult<NotUndefined<PostResponse>['pages'][number][number]>;

type RawPost = Omit<Post, 'likes'>;

const isRawLikeArray = (post: PostResultValue): post is Like[] => Array.isArray(post)
const isRawPost = (post: PostResultValue): post is RawPost => Object.hasOwnProperty.call(post, 'content')

const convertRawPosts = (rawResults: PostResponse): Post[] => {
    if (!rawResults) return [];

    const posts: Post[] = rawResults.pages.flatMap((page) =>
        page.map((entry) => {
            if (entry.status === "failure") return undefined;
            if (isRawPost(entry.result)) return {
                ...entry.result,
                likes: [] as Like[]
            }
        }).filter((post): post is Post => !!post));

    rawResults.pages.forEach((page) => page.forEach((entry) => {
        if (entry.status === "failure") return;
        if (isRawLikeArray(entry.result)) {
            if (entry.result.length === 0) return;
            const targetPost = posts.find((p) => p.id === entry.result[0].postId);
            if (!targetPost) return;
            targetPost.likes = entry.result;
        }
    }));

    return posts;
}

export const BoardProvider: FC<PropsWithChildren> = ({children}) => {
    const { posts: rawPosts, isLoadingPosts,
        errorLoadingBoards: error,
        fetchNextBoardsPage,
    } = useBoard();
    // add the converted posts to state so that they persist while useBoard is reloading
    const [posts, setPosts] = useState<Post[]>([]);
    useEffect(() => {
        if (!rawPosts || rawPosts.pages.length === 0) return;
        setPosts(convertRawPosts(rawPosts));
    }, [rawPosts]);

    return (
        <BoardContext.Provider
            value={{
                posts,
                fetchNextBoardsPage,
                error
            }}
        >
            {children}
        </BoardContext.Provider>
    );
}

export const useBoardContext = () => useContext(BoardContext);