const express = require("express");
const {isAdmin, authMiddleware} = require("../middlewares/authMiddleware")
const {createCoupon, getAllCoupons} = require("../controller/couponController");
const router = express.Router();


router.post("/", authMiddleware, isAdmin, createCoupon);
router.get("/", authMiddleware, isAdmin, getAllCoupons);


module.exports = router;