const mongoose = require('mongoose');

const Store = new mongoose.Schema({
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

const storeCollection = new mongoose.Schema({
  type: {
    type: String, 
    enum: ['FeatureCollection'], 
    required: true
  },
  features:[Store],
},{ 
  collection: 'StoreCollection'
})

module.exports = mongoose.model('StoreCollection',storeCollection);
// module.exports = mongoose.model('Store',store);
// module.exports = mongoose.model({ Store},{StoreCollection });

