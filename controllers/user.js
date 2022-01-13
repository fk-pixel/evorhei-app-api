const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Products = require("../models/products");

// Register
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const { email, password, username } = req.body;

    // Password encryption
    const cryptedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: cryptedPassword,
      username: username,
    });
    await user.save();
    res.status(200).json({
      message: `User ${username} created succesfully`,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error(`This User ${username}  not found`);
      error.statusCode = 401;
      throw error;
    }
    const isRegistered = await bcrypt.compare(password, user.password);
    if (!isRegistered) {
      const error = new Error(`Password ${password} does not match`);
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: user.email,
        userid: user._id.toString(),
      },
      process.env.JWT_KEY,
      { expiresIn: "12h" } //during token is valid
    );
    res.status(200).json({
      token: token,
      userId: user._id.toString(),
      user: user,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// Logout
exports.logout = async (req, res, next) => {
  try {
    const userId = req.userid;
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 401;
      throw error;
    }
    res.status(204).json({ message: "User successfully signed out" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// Get List
exports.getList = async (req, res, next) => {
  try {
    const userId = req.userid;
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 401;
      throw error;
    }
    const products = [];
    for (const list of user.list) {
      const product = await Products.findById(list.product);
      if (!products) {
        console.log("no-product")
      } else {
        products.push(product);
      }
    }

    res.status(200).json(products);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
// Delete from userlist 
exports.deleteProductFromUserList = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    console.log(productId, req.userid);
    const user = await User.findById(req.userid);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 401;
      throw error;
    }

    user.list = user.list.filter((list) => list.product != productId);
    await Products.findByIdAndDelete(productId);
    await user.save();
    res
      .status(200)
      .json({ message: "Product deleted successfully from user list." });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
