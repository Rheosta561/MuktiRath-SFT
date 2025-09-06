const Product = require('../Models/Product');

// create product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, imageUrl, category, tags } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      imageUrl,
      category,
      tags,
    });

    await newProduct.save();

    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// Get All Products (with optional search)
exports.getProducts = async (req, res) => {
  try {
    const { search } = req.query; // ?search=laptop

    let query = {};

    if (search) {
      const regex = new RegExp(search, "i"); // case-insensitive
      query = {
        $or: [
          { name: regex },
          { description: regex },
          { category: regex },
          { tags: regex }
        ],
      };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// Get Single Product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};


