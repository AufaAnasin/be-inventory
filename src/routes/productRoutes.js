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

router.post("/add-product", addProduct);
router.get("/products", getProducts);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);
router.get("/products/filter", filterProducts);
router.get("/products/pagination", getProductsWithPagination);
router.get('/products/search', searchProducts);

module.exports = router;
