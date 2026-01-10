const product_model = require("../models/product.model");
const cart_model = require("../models/cart.model");

exports.addToCart = async (req, res) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    try {
        const product = await product_model.findById(productId);
        if (!product) {
            return res.status(404).send({
                message: "Product not found"
            });
        }

        if (quantity > product.stock) {
            return res.status(400).send({
                message: "Requested quantity exceeds available stock"
            });
        }

        let cart = await cart_model.findOne({ user: userId });

        if (!cart) {
            cart = await cart_model.create({
                user: userId,
                items: [{ product: productId, quantity }]
            });
            return res.status(201).send(cart);
        }

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex > -1) {
            const newQuantity = cart.items[itemIndex].quantity + quantity;

            if (newQuantity > product.stock) {
                return res.status(400).send({
                    message: "Total quantity exceeds available stock"
                });
            }

            cart.items[itemIndex].quantity = newQuantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save(); 

        return res.status(200).send(cart);

    } catch (err) {
        console.log("Error while adding to cart", err);
        return res.status(500).send({
            message: "Some internal error while adding to cart"
        });
    }
};

exports.getMyCart = async (req, res) => {
    const userId = req.user._id;

    try {
        const cart = await cart_model.findOne({ user: userId })
            .populate("items.product", "name price images stock");

        // If cart does not exist, return empty cart
        if (!cart) {
            return res.status(200).send({
                user: userId,
                items: []
            });
        }

        return res.status(200).send(cart);

    } catch (err) {
        console.log("Error while fetching cart", err);
        return res.status(500).send({
            message: "Some internal error while fetching cart"
        });
    }
};

exports.updateCartQuantity = async (req, res) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    try {
        //Check product exists
        const product = await product_model.findById(productId);
        if (!product) {
            return res.status(404).send({
                message: "Product not found"
            });
        }

        //Check stock
        if (quantity > product.stock) {
            return res.status(400).send({
                message: "Requested quantity exceeds available stock"
            });
        }

        //Find user's cart
        const cart = await cart_model.findOne({ user: userId });
        if (!cart) {
            return res.status(404).send({
                message: "Cart not found"
            });
        }

        //Find product in cart
        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).send({
                message: "Product not found in cart"
            });
        }

        //Update quantity
        cart.items[itemIndex].quantity = quantity;

        //Save cart
        await cart.save();

        return res.status(200).send(cart);

    } catch (err) {
        console.log("Error while updating cart quantity", err);
        return res.status(500).send({
            message: "Some internal error while updating cart"
        });
    }
};

