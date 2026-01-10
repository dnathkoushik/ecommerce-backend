const cartController = require("../controllers/cart.controller");
const cartMW = require("../middlewares/cart.mw");
const authMW = require("../middlewares/auth.mw");

module.exports = (app) => {
    app.post("/ecomm/api/v1/cart", [authMW.verifyToken, cartMW.validateAddToCart], cartController.addToCart);
    app.get("/ecomm/api/v1/cart", [authMW.verifyToken], cartController.getMyCart);
    app.put("/ecomm/api/v1/cart", [authMW.verifyToken, cartMW.validateUpdateCartQuantity], cartController.updateCartQuantity);
    app.delete("/ecomm/api/v1/cart/:productId", [authMW.verifyToken, cartMW.validateRemoveFromCart], cartController.removeFromCart);
}