const order_model = require("../models/order.model");
const cart_model = require("../models/cart.model");
const product_model = require("../models/product.model");

exports.placeOrder = async (req, res) => {
    const userId = req.user._id;

    try {
        //Get user's cart
        const cart = await cart_model.findOne({ user: userId })
            .populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).send({
                message: "Cart is empty"
            });
        }

        let orderItems = [];
        let totalAmount = 0;

        //Validate stock & prepare order items
        for (const item of cart.items) {
            const product = item.product;

            if (item.quantity > product.stock) {
                return res.status(400).send({
                    message: `Insufficient stock for ${product.name}`
                });
            }

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price   // snapshot price
            });

            totalAmount += product.price * item.quantity;
        }

        //Create order
        const order = await order_model.create({
            user: userId,
            items: orderItems,
            totalAmount
        });

        //Reduce product stock
        for (const item of cart.items) {
            await product_model.findByIdAndUpdate(
                item.product._id,
                { $inc: { stock: -item.quantity } }
            );
        }

        //Clear cart
        cart.items = [];
        await cart.save();

        return res.status(201).send(order);

    } catch (err) {
        console.log("Error while placing order", err);
        return res.status(500).send({
            message: "Some internal error while placing order"
        });
    }
};

exports.getMyOrders = async (req, res) => {
    const userId = req.user._id;

    try {
        const orders = await order_model.find({ user: userId })
            .populate("items.product", "name images")
            .sort({ createdAt: -1 });

        return res.status(200).send(orders);

    } catch (err) {
        console.log("Error while fetching user orders", err);
        return res.status(500).send({
            message: "Some internal error while fetching orders"
        });
    }
};
