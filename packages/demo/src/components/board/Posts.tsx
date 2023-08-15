import {useBoardContext} from "../../context/BoardContext";
import {useBoardGetPostCount} from "../../hooks/useBoardGetPostCount";
import InfiniteScroll from "react-infinite-scroll-component";
import {useMemo} from "react";
import {PostView} from "./PostView";

export function Posts() {
    const { posts, fetchNextBoardsPage, error } = useBoardContext();
    const count = useBoardGetPostCount()

    const hasMore = useMemo(() => {
        return !!count && posts.length < count;
    }, [count, posts.length]);

    const onNext = () => {
        if (hasMore) {
            console.log('fetchNextBoardsPage')
            fetchNextBoardsPage();
        }
    }

    return (
        <div className="flex flex-col items-center overflow-auto">
            <InfiniteScroll
                className=""
                height={400}
                dataLength={posts.length}
                next={onNext}
                hasMore={hasMore}
                loader={
                    <span className="loading loading-spinner loading-sm"></span>
                }
            >
                {posts.map(post => (
                    // <PostView key={post.id.toString()} post={post} />
                    <div className="flex flex-wrap justify-center" key={post.id.toString()}>
                        <PostView post={post} />
                    </div>
                ))}
            </InfiniteScroll>
        </div>
    );
}