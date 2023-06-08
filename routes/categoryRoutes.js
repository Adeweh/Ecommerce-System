const express = require("express");
const {isAdmin, authMiddleware} = require("../middlewares/authMiddleware")
const {createCategory} = require("../controller/categoryController");
const router = express.Router();



router.post("/", createCategory);




module.exports = router;
