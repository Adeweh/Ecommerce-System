const express = require("express");
const {isAdmin, authMiddleware} = require("../middlewares/authMiddleware")
const {createCategory, updateCategory} = require("../controller/productCategoryController");
const router = express.Router();



router.post("/", authMiddleware, isAdmin, createCategory);

router.put("/:id", authMiddleware, isAdmin, updateCategory);




module.exports = router;
