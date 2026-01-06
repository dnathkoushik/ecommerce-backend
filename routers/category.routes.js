const categoryController = require("../controllers/category.controller");
const categoryMW = require("../middlewares/category.mw");
const authMW = require("../middlewares/auth.mw");

module.exports = (app) => {
    app.post("/ecomm/api/v1/categories", [authMW.verifyToken, authMW.isAdmin, categoryMW.validateCategoryBody], categoryController.createNewCategory);
    app.delete("/ecomm/api/v1/categories/:categoryId", [authMW.verifyToken, authMW.isAdmin], categoryController.deleteCategoryById);
    app.get("/ecomm/api/v1/categories", categoryController.getAllCategories);
    app.get("/ecomm/api/v1/categories/:categoryId", categoryController.getCategoryById);
}