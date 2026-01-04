/**
 * Create a mw to check if the request mody is proper and correct
 */

const user_model = require("../models/user.model");

const verifySignUpBody = async (req, res, next) => {
    try{
        //check for the name
        if(!req.body.name){
            return res.status(400).send({
                message : "Failed! Name is not provided in the request body"
            });
        }

        //check for tha email
        if(!req.body.email){
            return res.status(400).send({
                message : "Failed! Email is not provided in the request body"
            });
        }

        //check for the userId
        if(!req.body.userId){
            return res.status(400).send({
                message : "Failed! userId is not provided in the request body"
            });
        }

        //check if the user with the same userId is already present
        const user = await user_model.findOne({userId : req.body.userId});
        if(user){
            return res.status(400).send({
                message : "Failed! user with the same userId is already taken"
            });
        }
        next();
        
    } catch(err){
        console.log("Error while validating the request body object", err);
        res.status(500).send({
            message : "Some internal error while validating the request body",
        })
    }
}

module.exports = {
    verifySignUpBody : verifySignUpBody
};