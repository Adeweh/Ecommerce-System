const express = require("express");
const router = express.Router();
const {createUser, loginUser, getAllUser, getAUser, deleteUser, updateUser, blockUser, unblockUser} = require("../controller/userController");
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");



router.post('/register', createUser);
router.post('/login', loginUser );
router.get('/get-all-users', getAllUser);
router.get('/:id', authMiddleware, isAdmin, getAUser);
router.delete('/:id', deleteUser);
router.put('/edit-user',authMiddleware, updateUser);
router.put('/block-user/:id',authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id',authMiddleware, isAdmin, unblockUser);
 
module.exports = router;
