const product_model = require('../models/product.model');
const category_model = require('../models/category.model');
const mongoose = require('mongoose');

exports.createProduct = async (req, res) => {
    try {
        const categoryExists = await category_model.findById(req.body.category);
        if (!categoryExists) {
            return res.status(400).send({ message: "Category does not exist" });
        }

        const product = await product_model.create({
            ...req.body,
            createdBy: req.user._id
        });

        return res.status(201).send(product);

    } catch (err) {
        return res.status(500).send({
            message: "Some internal error while creating the product"
        });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await product_model
            .find()
            .populate("category", "name description")
            .populate("createdBy", "name email userType");

        return res.status(200).send(products);

    } catch (err) {
        console.log("Error while fetching products", err);
        return res.status(500).send({
            message: "Some internal error while fetching products"
        });
    }
};

exports.getProductById = async (req, res) => {
    const product_id = req.params.productId;

    if (!mongoose.Types.ObjectId.isValid(product_id)) {
        return res.status(400).send({
            message: "Invalid product ID"
        });
    }

    try {
        const product = await product_model
            .findById(product_id)
            .populate("category", "name description")
            .populate("createdBy", "name email userType");

        if (!product) {
            return res.status(404).send({
                message: "Product not found"
            });
        }

        return res.status(200).send(product);

    } catch (err) {
        return res.status(500).send({
            message: "Some internal error while fetching product"
        });
    }
};

exports.getProductsByCategory = async (req, res) => {
    const categoryId = req.params.categoryId;

    // 1️⃣ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).send({
            message: "Invalid category ID"
        });
    }

    try {
        // 2️⃣ Check if category exists
        const categoryExists = await category_model.findById(categoryId);
        if (!categoryExists) {
            return res.status(404).send({
                message: "Category not found"
            });
        }

        // 3️⃣ Fetch products of that category
        const products = await product_model
            .find({ category: categoryId })
            .populate("category", "name description");

        return res.status(200).send(products);

    } catch (err) {
        console.log("Error while fetching products by category", err);
        return res.status(500).send({
            message: "Some internal error while fetching products"
        });
    }
};

exports.updateProduct = async (req, res) => {
    const productId = req.params.productId;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).send({
            message: "Invalid product ID"
        });
    }

    const updateObj = {};

    if (req.body.name) updateObj.name = req.body.name;
    if (req.body.description) updateObj.description = req.body.description;
    if (req.body.price !== undefined) updateObj.price = req.body.price;
    if (req.body.stock !== undefined) updateObj.stock = req.body.stock;
    if (req.body.images) updateObj.images = req.body.images;
    if (req.body.category) updateObj.category = req.body.category;

    try {
        if (updateObj.category) {
            if (!mongoose.Types.ObjectId.isValid(updateObj.category)) {
                return res.status(400).send({
                    message: "Invalid category ID"
                });
            }

            const categoryExists = await category_model.findById(updateObj.category);
            if (!categoryExists) {
                return res.status(400).send({
                    message: "Category does not exist"
                });
            }
        }

        const updatedProduct = await product_model.findByIdAndUpdate(
            productId,
            updateObj,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).send({
                message: "Product not found"
            });
        }

        return res.status(200).send(updatedProduct);

    } catch (err) {
        console.log("Error while updating product", err);
        return res.status(500).send({
            message: "Some internal error while updating product"
        });
    }
};

exports.deleteProduct = async (req, res) => {
    const productId = req.params.productId;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).send({
            message: "Invalid product ID"
        });
    }
    try {
        const deletedProduct = await product_model.findByIdAndDelete(productId);    
        if (!deletedProduct) {
            return res.status(404).send({
                message: "Product not found"
            });
        }
        return res.status(200).send({
            message: "Product deleted successfully"
        });
    } catch (err) {
        console.log("Error while deleting product", err);
        return res.status(500).send({
            message: "Some internal error while deleting product"
        });
    }
};


