const Post = require("../../Model/PostModel/PostModel");
const User = require("../../Model/UserModel");
const catchAsync = require("../../utils/catchAync");
const AppError = require("../../Error-Handling/error");
const mongoose = require("mongoose");

exports.newPost = catchAsync(async (req, res, next) => {
  const postData = {
    caption: req.body.caption,
    image: req.body.image,
    video: req.body.video,
    postedBy: req.user._id,
  };

  const post = await Post.create(postData);
  const user = await User.findById(req.user._id);
  console.log(post, user, "vadfdv", postData, "tbhrtgsrtd");
  user.posts.push(post._id);
  console.log("post created");
  await user.save();

  if (post) {
    res.status(201).json({
      message: "success",
      post,
    });
  } else {
    return next(new AppError("Something went wrong", 500));
  }
});

exports.likeUnlikePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new AppError("Post Not Found", 404));
  }

  if (post.likes.includes(req.user._id)) {
    const index = post.likes.indexOf(req.user._id);

    post.likes.splice(index, 1);
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post Unliked",
    });
  } else {
    post.likes.push(req.user._id);

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post Liked",
    });
  }
});

exports.newComment = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.postID);

  if (!post) {
    return next(new AppError("Post Not Found", 404));
  }
  console.log(post);
  if (post.comments.includes(req.user._id)) {
    return next(new AppError("Already Commented", 500));
  }

  post.comments.push({
    user: req.user._id,
    comment: req.body.comment,
  });

  await post.save();

  if (post) {
    res.status(200).json({
      success: post,
      message: "Comment Added",
    });
  } else {
    return next(new AppError("Already Commented", 500));
  }
});

exports.getPostPerById = async (req, res, next) => {
  const data = await User.findById(req.user._id);
  const Posts = data.posts;
  console.log(Posts);

  const postToshow = await Promise.all(
    Posts.map(async (post) => {
      const id = post.toString();
      console.log("id", id);
      const data = await Post.findById(id);
      console.log("data", data);
      return data;
    })
  );
  return res.status(200).json({
    postToshow,
    message: "Like Added",
  });
};

exports.newLike = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.postID);
  if (!post) {
    return next(new AppError("Post Not Found", 404));
  }
  if (post.likes.includes(req.user._id)) {
    return next(new AppError("Already Liked", 500));
  }
  post.likes.push(req.user._id);
  await post.save();
  return res.status(200).json({
    success: post,
    message: "Like Added",
  });
});

exports.existingLikes = catchAsync(async (req, res, next) => {
  const post = await Post.findById(id);
  if (post.likes.includes(req.user._id)) {
    return next(new AppError("Already Liked", 500));
  }
});

// Get Post Details
exports.getPostDetails = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id)
    .populate("postedBy likes")
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    });
  if (!post) {
    return next(new AppError("Post Not Found", 404));
  }
  res.status(200).json({
    message: "success",
    post,
  });
});

// Get All Posts
exports.allPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find()
    .populate("postedBy likes")
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    })
    .sort({ createdAt: -1 });

  return res.status(200).json({
    posts,
  });
});
