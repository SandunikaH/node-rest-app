// create and export so that we can use this in other routes to authenticate users

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {        
        const encodedToken = req.headers.authorization.split(" ")[1];
        //console.log(encodedToken);
        
        //verify method verify the token and then return the decoded token
        const decodedToken = jwt.verify(encodedToken, process.env.JWT_KEY);
        req.userData = decodedToken;
        // call next(); if the authentication successful
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Authentication failed',
            error: error
        });
    }        
};