const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User  = new Schema ({
    username: {type: String, unique: true},
    password: String,
    purchased_data: [String],
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', User)