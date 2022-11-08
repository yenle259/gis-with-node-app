const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { loadStore, addStore } = require('./models/StoresModel')
const StoreCollection = require("./models/StoreCollection");
const mongoose = require('mongoose');
const app = express();

//load enviroment vars
dotenv.config({ path: './config/config.env' });

//set view using ejs
app.set('views', './views')
app.set('view engine', 'ejs')

// connect database
connectDB();


// body parser
app.use(express.json());

//enable cors
app.use(cors());

// Static file in publics
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))

app.get('/map', (req, res) => {
    res.render('map')
})
app.get('/home', (req, res) => {
    res.render('index')
})

app.get('/stores', (req, res) => {
    res.send(loadStore());
})

var bachhoaxanh = StoreCollection.findOne({ "_id": "6359293fd0eb15e890ee5d12" })
    .then(function (data) {
        app.get('/allstore', (req, res) => {
            res.send(data);
        })
    }).catch(function (err) {
        console.log('loi ke', err);
    })

app.post('/addPoint', (req, res) => {
    const dataObject = req.body;
    console.log(dataObject);
    addNewStore(dataObject);
});

function addNewStore(newStore) {
    StoreCollection.findOne({ "_id": "6359293fd0eb15e890ee5d12" }).then(function (data) {
        data.features.push(newStore);
        data.save();
    })
    connectDB();
}
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))