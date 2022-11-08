const { render } = require('ejs');
const {readFileSync} = require('fs');

let loadStore = () => 
    JSON.parse(readFileSync('geojson/stores.geojson'));

let addStore =()=>{

}
module.exports = {loadStore, addStore};