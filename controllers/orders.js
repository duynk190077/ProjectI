var express = require('express');
var router = express.Router();
const User = require('../models/User');
const Item = require('../models/Item');
const Order = require('../models/Order');
const { multipleMongooseToObject } = require('../util/mongoose');
const { mongoosesToObject } = require('../util/mongoose');
const { ObjectId } = require('mongodb');

router.delete('/delete', async function(req, res, next) {
    const user_id = req.user._id;
    const _id = req.body._id;
    Order.deleteOne({_id: _id})
        .then(() => {
            res.json({status: 'ok'})
        })
        .catch(next);
})

router.post('/create', async function(req, res, next) {
    const user_id = req.user._id;
    const {item_id, item_name, num, price, item_img, status} = req.body;
    const order = new Order({user_id, item_id, item_name, num, price, item_img, status});
    order.save()
        .then(order => {
            order: mongoosesToObject(order);
            if (status === 'paid') {
                Item.updateOne(
                    {_id: ObjectId(item_id)},
                    {
                        $inc: {numAvailable: -num, numPurchased: num},
                        $addToSet: {user_data: req.user._id.toString()},
                    },
                    function(err) {
                        if (err) throw err;
                    }
                )
                Order.findOne({item_id: item_id, user_id: user_id, status: 'paid', _id: {$nin: order._id}}, function(err, order) {
                    if (err) throw err;
                    if (!order) Item.updateOne(
                        {_id: ObjectId(item_id)},
                        {
                            $inc: {numOrdering: 1}
                        },
                        function(err) {
                            if (err) throw err
                        }
                    ) 
                })
            }
            return res.json({status: 'ok'});
        })
        .catch(next);
})

router.get('/', async function(req, res, next) {
    const user_id = req.user._id;
    Order.find({user_id: user_id, status: 'unpaid'}).lean()
        .then(orders => {
            return res.json({status: 'ok', orders: orders});
        })
        .catch(err => {
            return res.json({status: 'not order'});
        })
})


router.put('/update', async function(req, res, next) {
    await Order.find({_id: {$in: req.body.orderIds}}, function(err, orders) {
        if (err) throw err;
        for (let i = 0; i < orders.length; i++) {
            const item_id = orders[i].item_id;
            const num = orders[i].num;
            User.updateOne({_id: req.user._id}, {$addToSet: {purchased_data: item_id}}, function(err) {
                if (err) throw err;
            })
            Item.updateOne(
                {_id: ObjectId(item_id)},
                {
                    $inc: {numAvailable: -num, numPurchased: num},
                    $addToSet: {user_data: req.user._id.toString()},
                },
                function(err) {
                    if (err) throw err;
                }
            )
            Order.findOne({item_id: item_id, user_id: req.user._id, status: 'paid', _id: {$nin: req.body.orderIds}}, function(err, order) {
                if (err) throw err;
                if (!order) Item.updateOne(
                    {_id: ObjectId(item_id)},
                    {
                        $inc: {numOrdering: 1}
                    },
                    function(err) {
                        if (err) throw err
                    }
                ) 
            })
        }
    }).clone().catch(err => {
        next(err);
    })
    await Order.updateMany({_id: {$in: req.body.orderIds}}, {status: 'paid'}, function(err) {
        if (err) throw err;
        return res.json({status: 'ok'});
    })
})
module.exports = router;