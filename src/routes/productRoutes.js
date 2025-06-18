const express = require("express");
const router = express.Router();

const {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  filterProducts,
  getProductsWithPagination,
  searchProducts,
} = require("../controllers/productController");

const { authenticateToken } = require('../controllers/authController')

router.post("/add-product", authenticateToken, addProduct);
router.get("/products", getProducts);
router.put("/products/:id", authenticateToken, updateProduct);
router.delete("/products/:id", authenticateToken, deleteProduct);
router.get("/products/filter", filterProducts);
router.get("/products/pagination", getProductsWithPagination);
router.get('/products/search', searchProducts);

module.exports = router;
