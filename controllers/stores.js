// const Store = require('../models/Store');

// // @desc Get all stores
// // @route Get /api/v1/stores
// // @access Public

// exports.getStores = async (req, res, next) =>{
//     try {
//         const stores = await Store.find();

//         return res.status(200).json({
//             success: true,
//             count:stores.length,
//             data:stores
//         })
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({error: 'error!'});
//     }
// };

// // @desc Create new stores
// // @route POSR /api/v1/stores
// // @access Public

// exports.addStore = async (req, res, next) =>{
//     try {
//         // console.log(req.body);
//         const store = await Store.create(req.body);
//         return res.status(200).json({
//             success:true,
//             data:store
//         });
//     } catch (err) {
//         console.error(err);
//         if(
//             errr.code === 11000
//         ){
//             return res.status(400).json({error:"this store is already exists"});
//         }
//         res.status(500).json({error: 'Server error!'});
//     }
// };