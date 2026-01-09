const mongoose = require("mongoose");

exports.validateAddToCart = (req, res, next) => {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
        return res.status(400).send({
            message: "productId and quantity are required"
        });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).send({
            message: "Invalid product ID"
        });
    }

    if (quantity < 1) {
        return res.status(400).send({
            message: "Quantity must be at least 1"
        });
    }

    next();
};
