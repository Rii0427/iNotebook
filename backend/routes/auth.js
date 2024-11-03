const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const router = express.Router();

const JWT_SECRET = 'Rishabhisagood$boy';

//ROUTE 1: Create/Signup a user using: POST "/api/auth/createuser". No login required
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    let success=false;
    // if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //bad request with status code 400
        return res.status(400).json({success, errors: errors.array() });
    };

    //check whether the user with this email exists already
    try {
        let user = await User.findOne({ email: req.body.email });
        // console.log(user);
        if (user) {
            //Return bad request i.e. res.status(400)
            return res.status(400).json({success, error: "Sorry a user with this email already exists." })
        }

        //Hashing the password using salt and pepper method
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        //create a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })
        //Now no need of promises while using async await
        // .then(user => res.json(user))
        //   .catch(err => {console.log(err)

        // A JSON Web Token is a way to authenticate users by sending a token in the authorization header of an HTTP request. The token contains information about the user, such as their email, name etc.
        const data = {
            user: {
                id: user.id
            }
        }
        // This method is used to create and sign a JWT
        const authToken = jwt.sign(data, JWT_SECRET);
        success=true;
        res.json({ success,authToken });
        // res.json(user);
    } catch (error) {
        console.log(error.message);
        //send internal server error
        res.status(500).send("Internal Server Error");
    }
});

//ROUTE 2: Authenticate/LogIn a user using: POST "/api/auth/login". No login required
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    // if there are errors, return bad request and the errors
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //bad request with status code 400
        return res.status(400).json({success, errors: errors.array() });
    };

    const { email, password } = req.body;
    try {
        //check whether the user with this email exists or not
        let user = await User.findOne({ email: email });
        if (!user) {
            //bad request with status code 400
            return res.status(400).json({success, error: "Please try to login with correct credentials" });
        }
        //check whether the pasword is correct or not
        //returns true or false
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            //bad request with status code 400
            return res.status(400).json({ success,error: "Please try to login with correct credentials" });
        }

        const data = {
            user: {
                id: user.id
            }
        };
        // This method is used to create and sign a JWT
        const authToken = jwt.sign(data, JWT_SECRET);
        success=true;
        res.json({ success,authToken });

    } catch (error) {
        console.log(error.message);
        //send internal server error
        res.status(500).send("Internal Server Error");
    }
});

//ROUTE 3: Get logged in user's details using: POST "/api/auth/getuser".Login required
//Adding a middleware function "fetchuser"
router.post('/getuser',fetchuser, async (req, res) => {
    try {
        //we get userId with the help of fetchuser middleware function
        const userId = req.user.id;
        //finding user's all details except its password
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.log(error.message);
        //send internal server error
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;