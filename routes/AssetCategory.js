const express = require('express')
const router = express.Router()
const { assetCategory } = require('../models/index');
const jwt =require('jsonwebtoken')
function isAuthenticate(req, res, next) {
    const { auth } = req.headers
    jwt.verify(auth, 'Assettracker', (err, token) => {
        if (err) {
            res.json({ 'message': "unauthorized" })
            // res.redirect('/');
        }
        next();
    })
}


// add asset category
router.get('/', (req, res) => {
    res.render('assetCategory');
})


router.post('/add',isAuthenticate, async (req, res) => {
    try {
        const { asset } = req.body;
        if(!asset){
            return res.json({'message':'Name is Required'})
        }
        await assetCategory.create({ name: asset });
        return res.json({ "message": "Asset created" });
    }
    catch (e) {
        console.log("errorrr", e);
        return res.json({ "message": "error adding assetcategory" })
    }
})

router.put('/details/edit',isAuthenticate, async (req, res) => {
    const { name, id } = req.body;
    try {
        if(!name || !id){
            return res.json({'message':'Input is Required'})
        }
        await assetCategory.update({ name: name }, { where: { id: id } });
        return res.json({ "message": "Asset Category Updated!" });
    }
    catch (e) {
        console.log(e);
        return res.json({ 'error': e })
    }
})

router.post('/details/view"',isAuthenticate, async (req, res) => {
    const { id } = req.body;
    try {
        const AssetCategory = await assetCategory.findOne({ where: { id: id } });
        return res.send(asset);
    }
    catch (e) {
        return res.json({ "message": "Given id is not defined!" });
    }
})
router.delete('/delete/',isAuthenticate, async (req, res) => {
    var { id } = req.body;
    try {
        var asset = await assetCategory.destroy({ where: { id: id } });
        if (asset) {
            return res.json({ "message": "Deleted !" });
        }
    }
    catch (e) {
        return res.json({ "message": "id is not defined" });
    }

})

module.exports = router