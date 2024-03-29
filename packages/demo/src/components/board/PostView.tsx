import {Post} from "../../utils/types";
import {useBoardLike} from "../../hooks/useBoardLike";
import {errorMessage, trimAddress} from "../../utils/lib";
import {useCivicStatus} from "../../hooks/useCivicStatus";

type Props = { post : Post }
export const PostView = ({ post }: Props) => {
    const { enabled } = useCivicStatus();
    const { write, isSuccess, error, isPending }
        = useBoardLike({ postId: post.id })

    const onLike = () => {
        if (!!write) write();
    }

    return (
        <div className="card bordered m-4 bg-white shadow-lg">
            <div className="card-body">
                <div className="card-title flex justify-between items-center">
                    <div className="text-blue-600 font-semibold">
                        {trimAddress(post.author)}
                    </div>
                    <div className="text-sm text-gray-400">
                        {new Date(Number(post.createdAt * 1000n)).toLocaleString()}
                    </div>
                </div>
                <div className="content mt-4 mb-8">
                    {post.content}
                </div>
                <div className="footer">
                    <button
                        onClick={onLike}
                        className={`mt-2 btn btn-primary btn-sm items-center ${isPending ? 'loading' : ''}`}
                        disabled={isPending || !enabled}
                    >
                        Like
                    </button>
                    <div className="mt-4 text-sm text-gray-600">
                        {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
                        {post.likes.length > 0 && (
                            <div className="mt-2">
                                Liked by: {post.likes.map(l => trimAddress(l.liker)).join(', ')}
                            </div>
                        )}
                        {!!error && <div className="mt-4 text-red-500 alert alert-error">{errorMessage(error)}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}