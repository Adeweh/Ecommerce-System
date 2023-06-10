const express = require("express");
const {isAdmin, authMiddleware} = require("../middlewares/authMiddleware")
const {createBrand, updateBrand, deleteBrand, getBrand, getAllBrand} = require("../controller/brandController");
const router = express.Router();



router.post("/", authMiddleware, isAdmin, createBrand);

router.put("/:id", authMiddleware, isAdmin, updateBrand);
router.delete("/:id", authMiddleware, isAdmin, deleteBrand);
router.get("/:id", getBrand);
router.get("/", getAllBrand);




module.exports = router;
