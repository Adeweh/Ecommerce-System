const express = require("express");
const {isAdmin, authMiddleware} = require("../middlewares/authMiddleware")
const {createBlog, updateBlog, getBlog, getAllBlog, deleteBlog, likeBlog, dislikeBlog, uploadImages} = require("../controller/blogController");
const router = express.Router();
const { uploadPhoto, blogImageResize } = require("../middlewares/uploadImages");




router.post("/", authMiddleware, isAdmin, createBlog);
router.put("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array("images", 10), blogImageResize, uploadImages);

router.put("/likes", authMiddleware, likeBlog);
router.put("/dislikes", authMiddleware, dislikeBlog);
router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.get("/:id", getBlog);
router.get("/", getAllBlog);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);
router.put("/likes", authMiddleware, isAdmin, likeBlog);




module.exports = router;