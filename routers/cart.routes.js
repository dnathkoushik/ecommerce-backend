const cartController = require("../controllers/cart.controller");
const cartMW = require("../middlewares/cart.mw");
const authMW = require("../middlewares/auth.mw");

module.exports = (app) => {
    app.post("/ecomm/api/v1/cart", [authMW.verifyToken, cartMW.validateAddToCart], cartController.addToCart);
}