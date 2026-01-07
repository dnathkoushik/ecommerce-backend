const product_model = require('../models/product.model');
const category_model = require('../models/category.model');

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
