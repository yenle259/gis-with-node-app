const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    type: {
      type: String,
      enum: ['Feature'],
      required: true
    },
    properties:{
      name: String,
      address: String
    },
    geometry:{
      coordinates: {
        type: [Number],
        required: true
      },
      type: {
        type: String,
        enum: ['Point']
        // required: true
      },
    }
});

module.exports = mongoose.model('Store',storeSchema);
