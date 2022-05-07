const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Item  = new Schema ({
    name: String,
    description: String,
    type: String,
    image: String,
    price: Number,
    sale: Number,
    numAvailable: Number,
    user_data: [String],
    numOrdering: {
        type: Number,
        default: 0
    },
    numPurchased: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Item', Item) 