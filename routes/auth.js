const Joi =  require('joi');
const auth = require('../middleware/auth');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User} = require('../models/user');
const express = require('express');
const router = express.Router();

if(!config.get('jwtPrivateKey')) {
    console.error('Fatal error! App crashed finding the JWT private key.');
    process.exit(1);
}

router.get('/me', auth, async (req, res) => {
    const user = await User.findOne({ _id: req.user._id}).select('-password');
    res.send(user);
});

router.post('/', async (req, res) => {
    const { error } = validateAuth(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password.');

    const token = user.generateAuthToken();
    res.send(token);
});

function validateAuth(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };

    return Joi.validate(req, schema);
}

module.exports = router;
module.exports.validate = validateAuth;
