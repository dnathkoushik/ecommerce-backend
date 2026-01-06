/**
 * Controller for creating the category
 * POST localhost:8888/ecomm/api/v1/categories
 * {
 *  "name" : "Electronics",
 *  "description" : "This category contains electronic items"
 * }
 */

const category_model = require("../models/category.model");

exports.createNewCategory = async (req, res) => {
    //read the request body
    const request_body = req.body;

    //create the category object
    const category = {
        name : request_body.name,
        description : request_body.description
    };

    //insert the category object in the categories collection
    try{
        const obj = await category_model.create(category);
        return res.status(201).send(obj);
    } catch(err){
        console.log("Error while creating the category", err);
        return res.status(500).send({
            message : "Some internal error while creating the category",
        })
    }

    //return the response to the user

}

exports.deleteCategoryById = async (req, res) => {
    const category_id = req.params.categoryId;
    try{
        const deletedCategory = await category_model.findByIdAndDelete(category_id);

        if(!deletedCategory){
            return res.status(404).send({
                message : "Category not found with the given id"
            });
        }

        return res.status(200).send({
            message : "Category deleted successfully"
        });
    } catch(err){
        console.log("Error while deleting the category", err);
        return res.status(500).send({
            message : "Some internal error while deleting the category",
        })
    }
};