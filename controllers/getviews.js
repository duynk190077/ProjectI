var express = require('express');
var router = express.Router();

router.get('/orders/detail', function(req, res, next) {
    res.render('orders/detail');
})

module.exports = router;