const express = require("express");
const {isAdmin, authMiddleware} = require("../middlewares/authMiddleware")
const {createCoupon} = require("../controller/couponController");
const router = express.Router();


router.post("/", createCoupon);

module.exports = router;