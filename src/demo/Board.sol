// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Board {
    struct Post {
        uint256 id;
        string content;
        address author;
        uint256 createdAt;
    }
    struct Like {
        uint256 postId;
        address liker;
        uint256 createdAt;
    }

    Post[] public posts;
    Like[] public likes;

    event PostCreated(uint256 id, string content, address author, uint256 createdAt);
    event PostLiked(uint256 postId, address liker, uint256 createdAt);

    function createPost(string memory content) public {
        uint256 id = posts.length;
        uint256 createdAt = block.timestamp;
        posts.push(Post(id, content, msg.sender, createdAt));
        emit PostCreated(id, content, msg.sender, createdAt);
    }

    function getPostsCount() public view returns (uint256) {
        return posts.length;
    }

    function getPost(uint256 id) public view returns (Post memory) {
        return posts[id];
    }

    function likePost(uint256 postId) public {
        uint256 createdAt = block.timestamp;
        likes.push(Like(postId, msg.sender, createdAt));
        emit PostLiked(postId, msg.sender, createdAt);
    }

    function getLikesCount() public view returns (uint256) {
        return likes.length;
    }

    function getLike(uint256 id) public view returns (Like memory) {
        return likes[id];
    }

    function getLikesByPostId(uint256 postId) public view returns (Like[] memory) {
        Like[] memory postLikes;
        uint256 postLikesCount = 0;
        for (uint256 i = 0; i < likes.length; i++) {
            if (likes[i].postId == postId) {
                postLikesCount++;
            }
        }

        postLikes = new Like[](postLikesCount);
        uint256 postLikesIndex = 0;
        for (uint256 i = 0; i < likes.length; i++) {
            if (likes[i].postId == postId) {
                postLikes[postLikesIndex] = likes[i];
                postLikesIndex++;
            }
        }
        return postLikes;
    }
}