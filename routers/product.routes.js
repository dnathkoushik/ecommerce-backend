const productController = require('../controllers/product.controller');
const productMw = require('../middlewares/product.mw');
const authMw = require('../middlewares/auth.mw');

module.exports = (app) => {
    app.post("/ecomm/api/v1/products", [authMw.verifyToken, authMw.isAdmin, productMw.validateCreateProduct],productController.createProduct);
    app.get("/ecomm/api/v1/products", productController.getAllProducts);
    app.get("/ecomm/api/v1/categories/:categoryId/products", productController.getProductsByCategory);
    app.put("/ecomm/api/v1/products/:productId", [authMw.verifyToken, authMw.isAdmin, productMw.validateUpdateProduct], productController.updateProduct);
    app.delete("/ecomm/api/v1/products/:productId", [authMw.verifyToken, authMw.isAdmin], productController.deleteProduct);
};