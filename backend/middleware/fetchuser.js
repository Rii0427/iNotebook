require('dotenv').config();
var jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

//Middleware function to fetch user id from auth-token
const fetchuser = (req,res,next) => {
    //GET the user from the jwt token and add id to req object
    const token = req.header('auth-token');
    if(!token){
        //send HTTP 401 Unauthorized error
        return res.status(401).send({error: "Please authenticate using a valid token"});
    }
    try{
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    }catch(error){
        //send HTTP 401 Unauthorized error
        res.status(401).send({error: "Please authenticate using a valid token"});
    }
};

module.exports = fetchuser;