const express = require("express");
const { createProduct, getAProduct, getAllProduct, updateProduct, deleteProduct, addToWishList } = require("../controller/productController");
const {isAdmin, authMiddleware} = require("../middlewares/authMiddleware")
const router = express.Router();


router.post("/", authMiddleware, isAdmin, createProduct);
router.get("/:id", getAProduct);
router.put("/wishlist", authMiddleware, addToWishList);


router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);
router.get("/", getAllProduct);



module.exports = router;