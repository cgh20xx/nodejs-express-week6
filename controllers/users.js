const UserModel = require('../models/UserModel');
const successResponse = require('../services/successResponse');
const AppError = require('../services/appError');
const { generateJWT } = require('../services/auth');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const users = {
  /**
   * 註冊會員 (新增單筆使用者)
   * Doc:https://mongoosejs.com/docs/api/model.html#model_Model.create
   */
  async signUp(req, res, next) {
    console.log('signUp');
    let { name, email, password, confirmPassword } = req.body;
    // 檢查 name 空值
    name = name?.trim();
    if (!name) {
      return next(
        new AppError({
          statusCode: 400,
          message: '[註冊失敗] name 未填寫',
        })
      );
    }

    // 檢查 email 空值
    email = email?.trim();
    if (!email) {
      return next(
        new AppError({
          statusCode: 400,
          message: '[註冊失敗] email 未填寫',
        })
      );
    }

    // 檢查 email 格式
    if (!validator.isEmail(email)) {
      return next(
        new AppError({
          statusCode: 400,
          message: '[註冊失敗] email 格式錯誤',
        })
      );
    }

    // 檢查 email 是否已存在 DB
    const existUser = await UserModel.findOne({
      email: email,
    });
    if (existUser) {
      return next(
        new AppError({
          statusCode: 400,
          message: '[註冊失敗] email 已存在',
        })
      );
    }

    // 檢查 password 空值
    password = password?.trim();
    if (!password) {
      return next(
        new AppError({
          statusCode: 400,
          message: '[註冊失敗] password 未填寫',
        })
      );
    }

    // 密碼 8 碼以上
    if (!validator.isLength(password, { min: 8 })) {
      return next(
        new AppError({
          statusCode: 400,
          message: '[註冊失敗] password 長度少於8碼',
        })
      );
    }

    // 檢查 confirmPassword 空值
    confirmPassword = confirmPassword?.trim();
    if (!confirmPassword) {
      return next(
        new AppError({
          statusCode: 400,
          message: '[註冊失敗] confirmPassword 未填寫',
        })
      );
    }

    // 檢查 password confirmPassword 是否一致
    if (password !== confirmPassword) {
      return next(
        new AppError({
          statusCode: 400,
          message: '[註冊失敗] password 不一致',
        })
      );
    }

    // 存進資料庫的密碼需加密過
    password = await bcrypt.hash(password, 12);

    // 能到這裡表示以上檢查都通過，準備新增使用者。
    const newUser = await UserModel.create({
      name,
      email,
      password,
    });

    //  產生 jwt token
    const token = generateJWT(newUser._id);

    successResponse(res, { token, name: newUser.name });
  },
  /**
   * 登入 (發 JWT)
   */
  async logIn(req, res, next) {
    console.log('logIn');
    successResponse(res, { logIn: 1 });
  },

  /**
   * 重設密碼 (修改單筆使用者的密碼)
   * Doc:https://mongoosejs.com/docs/api/model.html#model_Model.findByIdAndUpdate
   */
  async updatPassword(req, res, next) {
    console.log('updatPassword');
    successResponse(res, { updatPassword: 1 });
  },
  /**
   * 取得所有使用者
   * Doc:https://mongoosejs.com/docs/api/model.html#model_Model.find
   */
  async getUsers(req, res, next) {
    const allUser = await UserModel.find();
    successResponse(res, allUser);
  },
  /**
   * 刪除所有使用者
   * Doc:https://mongoosejs.com/docs/api/model.html#model_Model.deleteMany
   */
  async deleteUsers(req, res, next) {
    await UserModel.deleteMany({});
    successResponse(res, []);
  },
  /**
   * 刪除單筆使用者
   * Doc:https://mongoosejs.com/docs/api/model.html#model_Model.findByIdAndDelete
   */
  async deleteUserById(req, res, next) {
    const id = req.params.id;
    const deleteUserById = await UserModel.findByIdAndDelete(id);
    if (!deleteUserById)
      return next(
        new AppError({
          statusCode: 400,
          message: '[刪除使用者失敗] 沒有此 id',
        })
      );
    successResponse(res, deleteUserById);
  },
  /**
   * 取得個人資料 (取得單筆使用者)
   * Doc:https://mongoosejs.com/docs/api/model.html#model_Model.findById
   */
  async getUserById(req, res, next) {
    console.log('getUserById');
    successResponse(res, { getUserById: 1 });
  },
  /**
   * 更新個人資料 (修改單筆使用者)
   * Doc:https://mongoosejs.com/docs/api/model.html#model_Model.findByIdAndUpdate
   */
  async updateUserById(req, res, next) {
    const { body } = req;
    const id = req.params.id;
    if (body.email !== undefined)
      return next(
        new AppError({
          statusCode: 400,
          message: '[修改使用者失敗] 不可修改 email',
        })
      );
    body.name = body.name?.trim(); // 頭尾去空白
    if (!body.name)
      return next(
        new AppError({
          statusCode: 400,
          message: '[修改使用者失敗] name 未填寫',
        })
      );
    const updateUserById = await UserModel.findByIdAndUpdate(
      id,
      {
        name: body.name,
        photo: body.photo,
      },
      {
        // 加這行才會返回更新後的資料，否則為更新前的資料。
        returnDocument: 'after',
        // update 相關語法預設 runValidators: false，需手動設寪 true。Doc:https://mongoosejs.com/docs/validation.html#update-validators
        runValidators: true,
      }
    );
    if (!updateUserById)
      return next(
        new AppError({
          statusCode: 400,
          message: '[修改使用者失敗] 沒有此 id',
        })
      );
    successResponse(res, updateUserById);
  },
};
module.exports = users;
