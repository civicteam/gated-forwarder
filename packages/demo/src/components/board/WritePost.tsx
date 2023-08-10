import {useBoardCreatePost} from "../../hooks/useBoardCreatePost";
import {useState} from "react";
import {useRelayerContext} from "../../context/RelayerContext";

export const WritePost = () => {
    const [content, setContent] = useState<string>("")
    const { write, isSuccess, txHash, error, isPending }
        = useBoardCreatePost({ content })

    return (
        <div className="flex flex-col items-center">
            <div className="w-full md:w-1/2 items-center">
    <textarea
        className="textarea textarea-bordered p-2 rounded-lg shadow-inner w-full"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your post..."
    />
                <button
                    className="btn btn-primary mt-2 w-full"
                    onClick={() => write && write()}
                    disabled={isPending}
                >
                    {isPending ? "Submitting..." : "Submit"}
                </button>
                {isSuccess && (
                    <div className="mt-2 alert alert-success">
                        <div>
                            <div className="write-post-success-message">
                                Post submitted!
                            </div>
                            <div className="write-post-success-receipt">
                                Transaction hash: {txHash}
                            </div>
                        </div>
                    </div>
                )}
                {!!error && (
                    <div className="alert alert-error mt-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{(error as Error).message as string}</span>
                    </div>
                )}
            </div>
        </div>
    )
}