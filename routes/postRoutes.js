const express = require("express");
const { createPost, updatePost,deletePost,getAllPosts,getMyPosts,addFeedback ,getMyFeedbacks} = require("../controllers/postController");

const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", verifyToken, createPost);
router.put("/edit/:id", verifyToken, updatePost);
router.delete("/delete/:id", verifyToken, deletePost);
router.get("/all", getAllPosts);
router.get("/my-posts", verifyToken, getMyPosts);
router.post("/feedback/:postId", addFeedback);
router.get("/my-feedbacks", verifyToken, getMyFeedbacks);



module.exports = router;
