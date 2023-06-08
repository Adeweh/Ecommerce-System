const express = require("express");
const {isAdmin, authMiddleware} = require("../middlewares/authMiddleware")
const {createBlog, updateBlog, getBlog, getAllBlog, deleteBlog, likeBlog} = require("../controller/blogController");
const router = express.Router();



router.post("/", authMiddleware, isAdmin, createBlog);
router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.get("/:id", getBlog);
router.get("/", getAllBlog);
router.delete("/:id", authMiddleware, isAdmin, deleteBlog);
router.put("/likes", authMiddleware, isAdmin, likeBlog);




module.exports = router;