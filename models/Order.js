const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Order = new Schema ({
    user_id: String,
    item_id: String,
    item_name: String,
    num: Number,
    price: Number,
    item_img: String,
    status: {
        type: String,
        enum: ['paid', 'unpaid'],
        default: 'unpaid'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Order', Order);