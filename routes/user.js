const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const User = require("../models/user");
const authController = require("../controllers/user");
const isAuth = require("../middlewares/isAuth");

router.post(
  "/register",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter valid email")
      .custom(async (value, { req }) => {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("Email already existed");
        }
      }),
    body("password").trim().isLength({ min: 5 }),
    body("username").trim().not().isEmpty(),
  ],
  authController.register
);
router.post("/login", authController.login);
router.get("/get-list", isAuth, authController.getList);
router.post("/logout", isAuth, authController.logout);

router.delete(
  "/delete-list/:productId",
  isAuth,
  authController.deleteProductFromUserList
);

module.exports = router;
