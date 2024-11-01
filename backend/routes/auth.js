const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

const router = express.Router();

//Create a user using: POST "/api/auth/createuser". No login required
router.post('/', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    // if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    };

    //check whether the user with this email exists already
    try {
        let user = await User.findOne({ email: req.body.email });
        // console.log(user);
        if (user) {
            //Return bad request i.e. res.status(400)
            return res.status(400).json({ error: "Sorry a user with this email already exists." })
        }
        //create a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        })
        //Now no need of promises while using async await
        // .then(user => res.json(user))
        //   .catch(err => {console.log(err)
        //   res.json({error: "Please enter a unique value for email", message: err.message})});

        res.json(user)
    } catch (error) {
        console.log(error.message);
        //send internal server error
        res.status(500).send("Some error occured")
    }
});

module.exports = router;