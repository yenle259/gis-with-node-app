const { Schema, default: mongoose } = require("mongoose");

const StoreSchema = new mongoose.Schema({
    type: String,
    properties:{
        name: String,
        address: String,
    },
    geometry:{
        coordinates:{
            type: [Number],
            required: true
        },
        type: {
            type: String, 
            enum: ['Point'], 
            required: true
          },
    }
})