/**
 * Creating a middleware to validate category creation request body
 */

const category_model = require("../models/category.model");

const validateCategoryBody = async (req, res, next) => {
    try{
        //check for the name
        if(!req.body.name){
            return res.status(400).send({
                message : "Failed! Category name is not provided in the request body"
            });
        }
        //check for the description
        if(!req.body.description){
            return res.status(400).send({
                message : "Failed! Category description is not provided in the request body"
            });
        }
        //check if the category with the same name is already present
        const category = await category_model.findOne({name : req.body.name});
        if(category){
            return res.status(400).send({
                message : "Failed! Category with the same name is already present"
            });
        }
        next();
    }
    catch(err){
        console.log("Error while validating the category request body", err);
        res.status(500).send({
            message : "Some internal error while validating the category request body",
        })
    }
};

module.exports = {
    validateCategoryBody : validateCategoryBody
};