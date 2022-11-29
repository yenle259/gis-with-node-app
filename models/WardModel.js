const mongoose = require('mongoose');
const ward = new mongoose.Schema({
    ward: String,
})

module.exports = mongoose.model('WardCollection',ward);

