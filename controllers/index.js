var express = require('express');
var router = express.Router();
const Item = require('../models/Item');
const { multipleMongooseToObject } = require('../util/mongoose');
/* GET home page. */
router.get('/', function(req, res, next) {
  let items = Item.find();
  if (req.query.hasOwnProperty('_sort')) {
    items = items.sort({
      [req.query.column]: req.query.type
    })
  }
  else {
    items = items.sort({
      ['createdAt']: 'desc'
    })
  }
  Promise.all([items])
    .then(([items]) => {
      res.render('index', {
        items: multipleMongooseToObject(items)
      })
    })
    .catch(next);
});
//get register
router.get('/register', function(req, res, next) {
  res.render('users/register');
})
//get login
router.get('/login', function(req, res, next) {
  res.render('users/login');
})
module.exports = router;
