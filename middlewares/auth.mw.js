/**
 * Create a mw to check if the request mody is proper and correct
 */

const user_model = require("../models/user.model");
const JWT = require("jsonwebtoken");
const auth_config = require("../configs/auth.config");

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
};

const verifySigninBody = async (req, res, next) => {
    try{
        //check for the userId
        if(!req.body.userId){
            return res.status(400).send({
                message : "Failed! userId is not provided in the request body"
            });
        }
        //check for the password
        if(!req.body.password){
            return res.status(400).send({
                message : "Failed! password is not provided in the request body"
            });
        }
        next();
    } catch(err){
        console.log("Error while validating the request body object", err);
        res.status(500).send({
            message : "Some internal error while validating the request body",
        })
    }
};

const verifyToken = (req, res, next) => {
    //Check if the token is present in the header
    const token = req.headers["x-access-token"];
    if(!token){
        return res.status(403).send({
            message : "No token provided! : Unauthorized",
        });
    }

    //If it's the valid token, proceed to the next middleware
    JWT.verify(token, auth_config.secret, async (err, decoded) => {
        if(err){
            return res.status(401).send({
                message : "Unauthorized! : Invalid token"
            });
        }
        const user = await user_model.findOne({userId : decoded.id});
        if(!user){
            return res.status(401).send({
                message : "Unauthorized! : The user for this token does not exist"
            });
        }
        //set the user info in the request body
        req.user = user;
        next();
    });

    //If it's not valid token, send an error response
};

const isAdmin = (req, res, next) => {
    //Check if the user is admin
    if(req.user && req.user.userType !== "ADMIN"){
        return res.status(403).send({
            message : "Forbidden! : User is not an admin"
        });
    }
    next();
};

module.exports = {
    verifySignUpBody : verifySignUpBody,
    verifySigninBody : verifySigninBody,
    verifyToken : verifyToken,
    isAdmin : isAdmin
};