const express = require("express");
const router = express.Router();

const productController = require("../controllers/product");
const isAuth = require("../middlewares/isAuth");

// Just authenticate user routes 
router.post("/add-product", isAuth, productController.addproduct);
router.patch("/:id", isAuth, productController.updateProduct);
router.delete("/:id", isAuth, productController.deleteProduct);

// All product without authentication routes 
router.post("/", productController.add);
router.get("/", productController.getProducts);

module.exports = router;
