const categoryController = require("../controllers/category.controller");
const categoryMW = require("../middlewares/category.mw");
const authMW = require("../middlewares/auth.mw");

module.exports = (app) => {
    app.post("/ecomm/api/v1/categories", [authMW.verifyToken, authMW.isAdmin, categoryMW.validateCategoryBody], categoryController.createNewCategory);
}