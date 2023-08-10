import {Address} from "viem";

export type Post = {
    id: bigint;
    content: string;
    author: Address;
    createdAt: bigint;
    likes: Like[];
}

export type Like = {
    postId: bigint;
    liker: Address;
    createdAt: bigint;
}