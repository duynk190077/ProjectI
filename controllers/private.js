var express = require('express');
var router = express.Router();
const Item = require('../models/Item');
const { multipleMongooseToObject } = require('../util/mongoose');
const { mongoosesToObject } = require('../util/mongoose');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'ProjectI';
const User = require('../models/User');

const adminMiddaleware =  (req, res, next) => {
    if (req.user.role === 'admin') next();
    else return next(new Error('Do not permission'));
}
// create items
router.get('/items/create', adminMiddaleware, function(req, res, next) {
    return res.json({status: 'ok'})
})

// list items
router.get('/items/list', adminMiddaleware, function(req, res, next) {
    return res.json({status: 'ok'});
})
// addnum item
router.get('/items/add', adminMiddaleware, function(req, res, next) {
    return res.json({status: 'ok'});
})
//user account
router.get('/users/account', function(req, res, next) {
    return res.json({status: 'ok'});
})

//user purchase
router.get('/users/account', function(req, res, next) {
    return res.json({status: 'ok'});
})
 //deatil order
router.get('/orders/detail', function(req, res, next) {
    return res.json({status: 'ok'});
})
module.exports = router;