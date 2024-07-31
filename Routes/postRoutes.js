const express = require("express");
const {
  newPost,
  likeUnlikePost,
  deletePost,
  newComment,
  allPosts,
  getPostsOfFollowing,
  updateCaption,
  saveUnsavePost,
  getPostDetails,
  newLike,
  getPostPerById,
} = require("../Controller/Post/PostController");
const { protectingRoutes } = require("../Controller/AuthController");

const router = express();

router.route("/commentpost/:postID").post(protectingRoutes, newComment);

router.route("/likepost/:postID").post(protectingRoutes, newLike);

router.route("/new").post(protectingRoutes, newPost);

router.route("/posts/all").get(allPosts);

router.route("/post/detail/:id").get(protectingRoutes, getPostDetails);

router.route("/postperuser").get(protectingRoutes, getPostPerById);

router.route("/post/comment/:id").post(protectingRoutes, newComment);

module.exports = router;
