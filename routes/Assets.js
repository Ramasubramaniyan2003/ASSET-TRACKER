const express = require('express')
const router = express.Router()
const { assetMaster, Admin, assetCategory, employees, assetHistory } = require('../models/index');

// add assets
router.get('/', (req, res) => {
    res.render('assetMaster');
})
router.post('/add', async (req, res) => {
    try {
        const { assetname, serial_no, model, make, scrapstatus, assettype, assetcategoryid } = req.body;
        const SerialNo = await assetMaster.findOne({ where: { serial_no: serial_no } })
        if (!assetname || !serial_no || !model || !make || !scrapstatus || !assettype) {
            return res.json({ 'message': 'Input fields should be required.' })
        }
        if (SerialNo) {
            return res.json({ 'message': 'Duplicate Serial No.' })
        }
       
        const asset = await assetMaster.create({ name: assetname, serial_no: serial_no, model: model, make: make, scrapstatus: scrapstatus, type: assettype, assetcategoryId: assetcategoryid })
        if (asset)
            return res.json({ "message": "Asset Added" })
    }
    catch (e) {
        console.log(e);
        return res.json({ "message": "Already exists" })
    }
})

router.post('/issue', async (req, res) => {
    try {
        const { EmployeeId, issueto, issuedate, AssetId, reason } = req.body;
        if (!EmployeeId || !issueto || !issuedate || !AssetId) {
            return res.json({ 'message': 'Input fields should be required.' })
        }
        const Asset = await assetHistory.create({ issueto: issueto, issuedate: issuedate, assetId: AssetId, transaction: 'Issue', reason: reason, employeeId: EmployeeId });
        await assetMaster.update({ 'employeeId': EmployeeId, 'status': 'Issued' }, { where: { 'id': AssetId } });
        if (!Asset) {
            return res.json({ "message": "Employee Undefined" })
        }
        return res.json({ "message": "Asset issued!" });
    }
    catch (e) {
        console.log("error at /issue", e);
        return res.json({ "message": e });
    }
})
router.post('/history', async (req, res) => {
    try {
        const { id } = req.body
        const history = await assetHistory.findAll({ where: { assetId: id } });
        if (history)
            return res.send(history)
        else {
            return res.json({ "message": "User Not Found." })
        }
    }
    catch (e) {
        console.log('Error in /history', e);
        res.json({ 'message': e })
    }
})

router.post('/return', async (req, res) => {
    try {
        const { id } = req.body;
        const ReturnAsset = await assetHistory.findOne({ attributes: ['issueto', 'issuedate'], where: { assetId: id }, order: [['id', 'DESC']] });
        const EmployeeId = await assetMaster.update({ employeeId: null, status: 'Unallocated' }, { where: { id: id } })
        if (ReturnAsset && EmployeeId) {
            return res.json({ "message": "sucess", "data": ReturnAsset });
        }
        else {
            return res.json({ "message": "Asset Undefined" });
        }
    }
    catch (e) {
        console.log('Error /return',e);
        return res.json({ "message": e });
    }
})
router.post('/scrap/', async (req, res) => {
    try {
        const { id, reason, date } = req.body
        if(!date){
            return res.json({"message":"The date field should be required."})
        }
        const asset = await assetHistory.create({ reason: reason, issuedate: date, transaction: 'Scrap', assetId: id })
        const ScrapStatus = await assetMaster.update({ scrapstatus: "Inactive", status: 'Scrapped' }, { where: { id: id } })
        if (asset && ScrapStatus)
            return res.json({ "message": "Asset Scrapped" })
        else
            return res.json({ 'message': 'Asset not found!' })
    }
    catch (e) {
        console.log("Error /scrap/",e);
        return res.json({ "message": e })
    }
})
router.post('/service/', async (req, res) => {
    try {
        const { id, reason, date } = req.body
        if(!date){
            return res.json({"message":"The date field should be required."})
        }
        const AssetService = await assetHistory.create({ reason: reason, issuedate: date, transaction: "Service", assetId: id })
        const ScrapStatus = await assetMaster.update({ status: 'Service' }, { where: { id: id } })
        if (AssetService && ScrapStatus)
            return res.json({ "message": "Service Added" })
        else
            return res.json({ "message": "Asset not added" })
    }
    catch (e) {
        console.log('Error in /service/',e);
        return res.json({ 'message': e })
    }
})

router.post('/service/return', async (req, res) => {
    try {
        const { id, reason, date } = req.body
        if(!date){
            return res.json({"message":"The date field should be required."})
        }
        const AssetReturn = await assetHistory.create({ reason: reason, issuedate: date, transaction: "Return Service", assetId: id })
        const ScrapStatus = await assetMaster.update({ status: 'Unallocated' }, { where: { id: id } })
        if (AssetReturn)
            return res.json({ "message": "Asset Returned" })
        else
            return res.json({ "message": "Error try again!" })
    }
    catch (e) {
        console.log('Error in /service/return',e);
        return res.json({ 'message': "" })
    }
})

// edit asset
router.post('/details/view', async (req, res) => {
    try {
        const { id } = req.body
        const asset = await assetMaster.findOne({ where: { id: id } });
        if (asset)
            return res.json({ "data": asset });
        else {
            return res.json({ 'message': 'No user found!' })
        }

    }
    catch (e) {
        console.log(e);
        return res.json({ "message": "details fetching error" });
    }
})
router.put('/details/edit', async (req, res) => {
    try {
        const { id, serial_no, name, model, make, scrapstatus } = req.body;

        if(!id || !serial_no || !name || !model || !make || !scrapstatus){
            return res.json({'message':'Input fields should be required.'})
        }
        const SerialNo=await assetMaster.findOne({where:{serial_no:SerialNo}})
        if(serial_no){
            return res.json({"message":"Duplicate Serial No"})
        }
        const asset = await assetMaster.update({ serial_no: serial_no, name: name, model: model, make: make, scrapstatus: scrapstatus }, { where: { id: id } })
        if (asset)
            return res.json({ "message": "Asset updated!" })
        else
            return res.json({ "message": "Error!" })
    }
    catch (e) {
        console.log(e);
        return res.json({ "message": "No records!" })
    }
})

router.post('/return/submit', async (req, res) => {
    try {
        const { date, reason, id, transaction, issueto } = req.body;
        if(!date || !transaction || !issueto){
            return res.json({"message":"Input fields should be required."})
        }
        const returnasset = await assetHistory.create({ issuedate: date, reason: reason, transaction: transaction, issueto: issueto, assetId: id })
        const ScrapStatus = await assetMaster.update({ status: 'Unallocated' }, { where: { id: id } })
        if (returnasset)
            return res.json({ "message": "Asset Returned!" })
        else
            return res.json({ "message": "Asset Not Found!" });
    }
    catch (e) {
        console.log(e);
        return res.json({ "message": "Invalid user!" })
    }
})
router.get('/details/history/', async (req, res) => {
    try {
        const assethistory = await assetHistory.findAll()
        res.send(assethistory);
    }
    catch (e) {
        console.log(e);
    }
})
router.get('/scrap/status', async (req, res) => {
    try {
        const scrap = await assetMaster.findAll({ attributes: ['scrapstatus', 'id'] })

        res.json({ "data": scrap })
    }
    catch (e) {
        res.sendStatus(400, e);
    }
})
module.exports = router