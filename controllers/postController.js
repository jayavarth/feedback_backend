const Post = require("../models/Post");

exports.createPost = async (req, res) => {
  const { image, caption } = req.body;
  const userId = req.userId; // Comes from middleware

  try {
    const post = new Post({
      userId,
      image,
      caption,
    });

    await post.save();
    res.status(201).json({ message: "Post created", post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePost = async (req, res) => {
  const { id } = req.params; // postId from URL
  const { image, caption } = req.body;
  const userId = req.userId; // From token

  try {
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // Only the post creator can update it
    if (post.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to edit this post" });
    }

    // Update fields if provided
    if (image) post.image = image;
    if (caption) post.caption = caption;

    await post.save();

    res.status(200).json({ message: "Post updated successfully", post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // Ensure the user owns the post
    if (post.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete this post" });
    }

    await post.deleteOne();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 }) // latest posts first
      .populate("userId", "email"); // populate user email

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getMyPosts = async (req, res) => {
  const userId = req.userId;

  try {
    const posts = await Post.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addFeedback = async (req, res) => {
  const { postId } = req.params;
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Feedback message is required" });
  }

  try {
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    post.feedbacks.push(message);
    await post.save();

    res.status(200).json({ message: "Feedback added", post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getMyFeedbacks = async (req, res) => {
  const userId = req.userId;

  try {
    const postsWithFeedbacks = await Post.find({
      userId,
      feedbacks: { $exists: true, $not: { $size: 0 } }
    })
    .sort({ createdAt: -1 })
    .select("caption image feedbacks createdAt");

    res.status(200).json(postsWithFeedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
