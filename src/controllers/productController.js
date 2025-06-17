const Product = require('../models/product');

// Logging function
const log = (message) => console.log(`[ProductController] ${new Date().toISOString()} - ${message}`);

// Validation function for addProduct
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

// Enhanced controller functions
exports.addProduct = async (req, res) => {
  try {
    // Validate request body
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

    // Create product with explicit validation
    const newProduct = await Product.create({
      name: name.trim(),
      description: description || null, // Handle undefined/null
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
      error: process.env.NODE_ENV === 'development' ? err.message : undefined, // Hide in production
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    log('Fetching all products');
    const products = await Product.findAll({
      order: [['createdAt', 'DESC']], // Sort by creation date
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
      error: process.env.NODE_ENV === 'development' ? err.message : undefined, // Hide in production
    });
  }
};