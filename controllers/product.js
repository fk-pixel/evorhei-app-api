const { validationResult } = require("express-validator");
const Product = require("../models/products");
const User = require("../models/user");

// Add product with user
exports.addproduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const { material, chargenNumber, menge } = req.body;
    const user = await User.findById(req.userid);
    if (user) {
      const product = new Product({
        material: material,
        chargenNumber: chargenNumber,
        menge: menge,

      });
      await product.creator.push({ user: user._id })
      const createdProduct = await product.save();
      user.list.push({ product: createdProduct._id });
      console.log("stop");
      await user.save();
      res.status(200).json({
        message: `Product added successfully created by user ${user.username}`,
      });
    } else {
      const error = new Error("User not found");
      error.statusCode = 404;
      error.data = errors.array();
      throw error;
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// Without user add product
exports.add = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const material = req.body.material;
    const chargenNumber = req.body.chargenNumber;
    const menge = req.body.menge;

    if (req.body) {
      let product = new Product({
        material: material,
        chargenNumber: chargenNumber,
        menge: menge,
      });

      await product.save();
      res.status(200).json({
        message: `Product added successfully`,
      });
    } else {
      const error = new Error("User not found");
      error.statusCode = 404;
      error.data = errors.array();
      throw error;
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// Get Product
exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

    if (!products) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(products);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// Update Product
exports.updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    await Product.findByIdAndUpdate(id, updates);
    res.send({ message: `Product ${updates.material} updated successfully` });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// Delete Product
exports.deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Product.findByIdAndDelete(id);
    res.send({ message: `Product ${id} deleted successfully` });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
