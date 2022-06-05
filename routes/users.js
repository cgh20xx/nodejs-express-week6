const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users');
const handleErrorAsync = require('../services/handleErrorAsync');

/* ===== User 相關功能 ===== */

// 取得所有使用者
router.get('/users', handleErrorAsync(UsersController.getUsers));

// 新增單筆使用者 (被註冊會員取代)
// router.post('/user', handleErrorAsync(UsersController.createUser));

// 刪除所有使用者
router.delete('/users', handleErrorAsync(UsersController.deleteUsers));

// 刪除單筆使用者
router.delete('/user/:id', handleErrorAsync(UsersController.deleteUserById));

// 修改單筆使用者 (被更新個人資料取代)
// router.patch('/user/:id', handleErrorAsync(UsersController.updateUserById));

/* ===== 會員功能 ===== */

// 註冊會員 (新增單筆使用者)
router.post('/user/sign_up', handleErrorAsync(UsersController.signUp));

// 登入 (發 JWT)
router.post('/user/log_in', handleErrorAsync(UsersController.logIn));

// 重設密碼
router.post(
  '/user/update_password',
  handleErrorAsync(UsersController.updateUserPassword)
);

// 取得個人資料 (取得單筆使用者)
router.get('/user/:id', handleErrorAsync(UsersController.getUser));

// 更新個人資料 (修改單筆使用者)
router.patch('/user/:id', handleErrorAsync(UsersController.updateUserById));

module.exports = router;
