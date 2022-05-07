var express = require('express');
var router = express.Router();
const Item = require('../models/Item');
const { multipleMongooseToObject } = require('../util/mongoose');
const { mongoosesToObject } = require('../util/mongoose');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'ProjectI';
const User = require('../models/User');
const Order = require('../models/Order');
const userMiddaleware = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) return next(new Error('Invalid token'));
    const token = authorizationHeader.split(' ')[1];
    const id = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id)
      .then(user => {
        req.user = mongoosesToObject(user);
        return next();
      })
      .catch(err => {
        return (err);
      });
  }
  catch (err) {
    return next(err)
  }
}
//create items
router.get('/create', function(req, res, next) {
  res.render('items/create');
})
router.get('/add', function(req, res, next) {
  Item.find() 
    .then(items => {
      res.render('items/add', {
        items: multipleMongooseToObject(items)
      });
    })
})
router.post('/create', function(req, res, next) {
  const item = new Item(req.body);
  item.save()
    .then(() => res.redirect('/items/create'))
    .catch(next)
})

// get update item
router.get('/edit/:id', async function(req, res, next) {
  await Item.findById(req.params.id)
    .then(item => {
      res.render('items/edit', {
        item: mongoosesToObject(item)
      })
    })
})

// update item
router.put('/:id', function(req, res, next) {
  Item.updateOne({_id: req.params.id}, req.body)
    .then(() => res.redirect('/items/list'))
    .catch(next)
})
//update num item
router.put('/:id/num', function(req, res, next) {
  const num = req.body.num;
  Item.updateOne({_id: req.params.id}, {$inc: {numAvailable: num}})
    .then(() =>  {
      return res.json({'status': 'updateSuccessfully'})
    })
    .catch(next);
})
//delete item
router.delete('/:id', function(req, res, next) {
  Item.deleteOne({_id: req.params.id})
    .then(() => res.redirect('back'))
    .catch(next);
})

//get list items
router.get('/list', function(req, res, next) {
  Item.find()
    .then(items => {
      res.render('items/list', {
        items: multipleMongooseToObject(items)
      })
    })
})

//get item
router.get('/:id', async function(req, res, next) {
  try {
    const id = req.params.id;
    let item = await Item.findOne({_id: id});
    let items_similar = await Item.find({type: item.type, _id: {$nin: item._id}}).sort({numPurchased: -1}).limit(5);
    let items = await Item.find({_id: {$nin: item._id}});
    var items_involve = [];
    for (let i = 0; i < items.length; i++) {
        if (validateItem(item.user_data, items[i].user_data) === true) {
          items_involve.push(items[i]);
        }
    }
    if (items_involve.length === 0) 
      items_involve = await Item.find({_id: {$nin: item._id}}).sort({numOrdering: -1}).skip(0).limit(5);
    Promise.all([item, items_similar, items_involve])
    .then(([item, items_similar, items_involve]) => {
      res.render('items/detail', {
        item: mongoosesToObject(item),
        items_similar: multipleMongooseToObject(items_similar),
        items_involve: multipleMongooseToObject(items_involve)
      });
    })
    .catch(next);
  }
  catch (err) {
    next(err);
  }
})
function validateItem(userdata1, userdata2) {
  //console.log(userdata1);
  let count = 0;
  for (let i = 0; i < userdata1.length; i++) {
    const user_id = userdata1[i];
    for (let j = 0; j < userdata2.length; j++)
      if (user_id === userdata2[i]) {
        count++;
        break;
      }
  }
  if ((count / userdata1.length) > 0.8) return true;
  return false; 
} 

module.exports = router;
