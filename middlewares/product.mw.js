const mongoose = require("mongoose");

exports.validateCreateProduct = (req, res, next) => {
    const { name, description, price, category } = req.body;

    if (!name || !description || price == null || !category) {
        return res.status(400).send({
            message: "Name, description, price and category are required"
        });
    }

    if (typeof price !== "number" || price < 0) {
        return res.status(400).send({
            message: "Price must be a positive number"
        });
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).send({
            message: "Invalid category ID"
        });
    }

    next();
};
