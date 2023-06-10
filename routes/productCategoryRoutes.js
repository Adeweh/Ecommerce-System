const express = require("express");
const {isAdmin, authMiddleware} = require("../middlewares/authMiddleware")
const {createCategory, updateCategory, deleteCategory, getCategory, getAllCatrgory} = require("../controller/productCategoryController");
const router = express.Router();



router.post("/", authMiddleware, isAdmin, createCategory);

router.put("/:id", authMiddleware, isAdmin, updateCategory);
router.delete("/:id", authMiddleware, isAdmin, deleteCategory);
router.get("/", getAllCatrgory);




module.exports = router;
