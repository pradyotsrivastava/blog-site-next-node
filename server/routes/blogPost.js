import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlogById,
  deleteBlogById,
} from "../controllers/blogPostController.js";

const router = express.Router();

router.post("/create", createBlog);
router.get("/", getAllBlogs);
router.get("/:postId", getBlogById);
router.put("/:postId", updateBlogById);
router.delete("/:postId", deleteBlogById);

export default router;
