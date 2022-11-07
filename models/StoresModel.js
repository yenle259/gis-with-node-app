const {readFileSync} = require('fs');

let loadStore = () => 
    JSON.parse(readFileSync('geojson/stores.geojson'));

module.exports = {loadStore};