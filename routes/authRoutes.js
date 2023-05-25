const express = require("express");
const router = express.Router();
const {createUser, loginUser, getAllUser, getAUser, deleteUser, updateUser} = require("../controller/userController");
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");



router.post('/register', createUser);
router.post('/login', loginUser );
router.get('/get-all-users', getAllUser);
router.get('/:id', authMiddleware, isAdmin, getAUser);
router.delete('/:id', deleteUser);
router.put('/edit-user',authMiddleware, updateUser);
 
module.exports = router;
