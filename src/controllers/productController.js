const Product = require('../models/product');
const { Op } = require('sequelize')

const log = (message) => console.log(`[ProductController] ${new Date().toISOString()} - ${message}`);

const validateProduct = (data) => {
  const errors = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Product name is required and must be a non-empty string');
  } else if (data.name.length > 100) {
    errors.push('Product name must not exceed 100 characters');
  }

  if (data.description && typeof data.description !== 'string' && data.description.length > 500) {
    errors.push('Description must not exceed 500 characters');
  }

  if (!Number.isInteger(data.quantity) || data.quantity < 0) {
    errors.push('Quantity must be a non-negative integer');
  }

  if (isNaN(data.price) || data.price < 0 || (data.price.toString().split('.')[1] || '').length > 2) {
    errors.push('Price must be a non-negative number with up to 2 decimal places');
  }

  return errors.length > 0 ? errors : null;
};

const validateFilterParams = (data) => {
  const errors = [];
  if (data.minPrice && (isNaN(data.minPrice) || data.minPrice < 0)) {
    errors.push('Minimum price must be a non-negative number');
  }
  if (data.maxPrice && (isNaN(data.maxPrice) || data.maxPrice < 0)) {
    errors.push('Maximum price must be a non-negative number');
  }
  if (data.minPrice && data.maxPrice && parseFloat(data.minPrice) > parseFloat(data.maxPrice)) {
    errors.push('Minimum price cannot be greater than maximum price');
  }
  return errors.length > 0 ? errors : null;
};

// Existing functions
exports.addProduct = async (req, res) => {
  try {
    const validationErrors = validateProduct(req.body);
    if (validationErrors) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors,
      });
    }

    const { name, description, quantity, price } = req.body;
    log(`Adding product: ${name}`);

    const newProduct = await Product.create({
      name: name.trim(),
      description: description || null,
      quantity,
      price,
    });

    log(`Product added successfully: ${newProduct.id}`);
    return res.status(201).json({
      success: true,
      message: 'Product added successfully!',
      product: newProduct,
    });
  } catch (err) {
    log(`Error adding product: ${err.message}`);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    log('Fetching all products');
    const products = await Product.findAll({
      order: [['createdAt', 'DESC']],
    });

    if (!products.length) {
      log('No products found');
      return res.status(200).json({
        success: true,
        message: 'No products found',
        products: [],
      });
    }

    log(`Fetched ${products.length} products`);
    return res.status(200).json({
      success: true,
      message: 'Products fetched successfully!',
      products,
    });
  } catch (err) {
    log(`Error fetching products: ${err.message}`);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const validationErrors = validateProduct(req.body);
    if (validationErrors) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors,
      });
    }

    log(`Updating product: ${id}`);
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const { name, description, quantity, price } = req.body;
    await product.update({
      name: name.trim(),
      description: description || null,
      quantity,
      price,
    });

    log(`Product updated successfully: ${id}`);
    return res.status(200).json({
      success: true,
      message: 'Product updated successfully!',
      product,
    });
  } catch (err) {
    log(`Error updating product: ${err.message}`);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    log(`Deleting product: ${id}`);
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await product.destroy();
    log(`Product deleted successfully: ${id}`);
    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully!',
    });
  } catch (err) {
    log(`Error deleting product: ${err.message}`);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

exports.filterProducts = async (req, res) => {
  try {
    const { minPrice, maxPrice, minQuantity, maxQuantity } = req.query;
    const validationErrors = validateFilterParams({ minPrice, maxPrice, minQuantity, maxQuantity });
    if (validationErrors) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors,
      });
    }

    log('Filtering products');
    let whereClause = {};
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) whereClause.price[Op.lte] = parseFloat(maxPrice);
    }
    if (minQuantity || maxQuantity) {
      whereClause.quantity = {};
      if (minQuantity) whereClause.quantity[Op.gte] = parseInt(minQuantity);
      if (maxQuantity) whereClause.quantity[Op.lte] = parseInt(maxQuantity);
    }

    log('Where clause:', whereClause); // Debug log
    const products = await Product.findAll({
      where: Object.keys(whereClause).length ? whereClause : null,
      order: [['createdAt', 'DESC']],
    });

    if (!products.length) {
      log('No products found with filter');
      return res.status(200).json({
        success: true,
        message: 'No products found with the given filter',
        products: [],
      });
    }

    log(`Fetched ${products.length} filtered products`);
    return res.status(200).json({
      success: true,
      message: 'Products filtered successfully!',
      products,
    });
  } catch (err) {
    log(`Error filtering products: ${err.message}`);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

exports.getProductsWithPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    log(`Fetching products with pagination - Page: ${page}, Limit: ${limit}`);
    const { count, rows: products } = await Product.findAndCountAll({
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });

    const totalPages = Math.ceil(count / limit);

    if (!products.length) {
      log('No products found on this page');
      return res.status(200).json({
        success: true,
        message: 'No products found on this page',
        products: [],
        pagination: { totalPages, currentPage: page, totalItems: count },
      });
    }

    log(`Fetched ${products.length} products on page ${page}`);
    return res.status(200).json({
      success: true,
      message: 'Products fetched with pagination!',
      products,
      pagination: { totalPages, currentPage: page, totalItems: count },
    });
  } catch (err) {
    log(`Error fetching products with pagination: ${err.message}`);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string' || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required and must be a non-empty string',
      });
    }

    log(`Searching products with query: ${q}`);
    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${q.trim()}%` } },
          { description: { [Op.like]: `%${q.trim()}%` } },
        ],
      },
      order: [['createdAt', 'DESC']],
    });

    if (!products.length) {
      log(`No products found for query: ${q}`);
      return res.status(200).json({
        success: true,
        message: 'No products found for the search query',
        products: [],
      });
    }

    log(`Fetched ${products.length} products for query: ${q}`);
    return res.status(200).json({
      success: true,
      message: 'Products searched successfully!',
      products,
    });
  } catch (err) {
    log(`Error searching products: ${err.message}`);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};