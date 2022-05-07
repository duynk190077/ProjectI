var express = require('express');
const { model } = require('mongoose');
var router = express.Router();
const User = require('../models/User');
const Item = require('../models/Item');
const { multipleMongooseToObject } = require('../util/mongoose');
const { mongoosesToObject } = require('../util/mongoose');
const JWT_SECRET = 'ProjectI';
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
// create user
router.post('/register', function(req, res, next) {
    const {username, password} = req.body;
    if (!username || typeof username !== 'string') {
        return res.json({status: 'err', err: 'Invalid username'});
    }
    if (!password || typeof password !== 'string') {
        return res.json({status: 'err', err: 'Invalid password'});
    }
    const user = new User({username, password});
    user.save()
        .then(() => res.redirect('/login'))
        .catch(next);
})

// post login
router.post('/login', function(req, res, next) {
    const {username, password} = req.body;
    User.findOne({username: username})
        .then(user => {
            user: mongoosesToObject(user);
            if (user.password === password) {
                const token = jwt.sign({
                    _id: user._id
                }, JWT_SECRET);
                return res.json({status: 'ok', token: token, username: username, role: user.role});
            }
            else return res.json({status: 'err', err: 'password is incorrect'});
        })
        .catch(err => {
            return res.status(500).json('loi sever');
        }) 
})

// logout
router.get('/logout', function(req, res, next) {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const id = jwt.verify(token, JWT_SECRET);
        if (id) {
            return res.json({status: 'ok'});
        }
    }
    catch (err) {
        return res.json({status: 'err', err: err});
    }

})

module.exports = router;