const Product = require("../models/product");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().lean();
    //console.log(products)
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Admin level
const createProduct = async (req, res) => {
  const { name, description, category, price, images } = req.body;
  try {
    const newProduct = new Product({
      name,
      description,
      category,
      price,
      images,
    });
    const product = await newProduct.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getProducts, createProduct };
