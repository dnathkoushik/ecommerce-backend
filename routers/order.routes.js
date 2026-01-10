const orderController = require("../controllers/order.controller");
const authMW = require("../middlewares/auth.mw");

module.exports = (app) => {
    app.post("/ecomm/api/v1/orders", [authMW.verifyToken], orderController.placeOrder);
};
