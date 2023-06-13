const express = require("express");
const {createUser, loginUser, getAllUser, getAUser, deleteUser, updateUser, blockUser, unblockUser, handleRefreshToken, logOut, updatePassword, forgotPasswordToken, resetPassword, loginAdmin} = require("../controller/userController");
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");
const router = express.Router();



router.post('/register', createUser);
router.post('/forgot-password-token', forgotPasswordToken)
router.put('/reset-password/:token', resetPassword)
router.put('/password', authMiddleware, updatePassword);
router.post('/login', loginUser );
router.post('/admin-login', loginAdmin );
router.get('/get-all-users', getAllUser);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logOut);
router.get('/:id', authMiddleware, isAdmin, getAUser);
router.delete('/:id', deleteUser);
router.put('/edit-user',authMiddleware, updateUser);
router.put('/block-user/:id',authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id',authMiddleware, isAdmin, unblockUser);

 
module.exports = router;
