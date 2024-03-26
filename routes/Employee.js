const express = require('express')
const router = express.Router()
const { employees } = require('../models/index');

function Validate(req, res, next) {
    const { name, email, contact, address, joindate, salary, department, status } = req.body
    if (!name) {
        return res.json({ 'Error': 'Name field should be required.' })
    }
    if (!email) {
        return res.json({ 'Error': 'Email field should be required.' })
    }
    if (!contact) {
        return res.json({ 'Error': 'Contact field should be required.' })
    }
    if (!address) {
        return res.json({ 'Error': 'Address field should be required.' })
    }
    if (!branch) {
        return res.json({ 'Error': 'Branch field should be required.' })
    }
    if (!joindate) {
        return res.json({ 'Error': 'Join Date field should be required.' })
    }
    if (!salary) {
        return res.json({ 'Error': 'Salary field should be required.' })
    }
    if (!department) {
        return res.json({ 'Error': 'Department field should be required.' })
    }
    if (!status) {
        return res.json({ 'Error': 'Status field should be required.' })
    }
    next()
}

router.get('/', (req, res) => {
    return res.render('employee');
})
router.get('/register', (req, res) => {
    res.render('employeeRegister');
})
router.post('/register/submit', Validate, async (req, res) => {

    try {
        const { name, email, contact, address, branch, joindate, enddate, salary, department, status } = req.body;
        const EmailCheck = await employees.findOne({ where: { email: email } })
        if (EmailCheck) {
            return res.json({ "Error": "Email Already Exists" })
        }
        const employeeinsert = await employees.create({ name: name, email: email, contact: contact, branch: branch, address: address, joinDate: joindate, endDate: enddate, salary: salary, department: department, status })
        if (!req.file) {
            console.log("file not uploaded");
        }
        else {
            console.log(req.file.fieldname, "file uploaded");
        }
        return res.send({ success: true });
    }
    catch (e) {
        console.log(e);
        return res.send({ success: false });
    }
})
router.put('/details/edit', async (req, res) => {
    const { id, name, email, contact, address, branch, joindate, enddate, salary, department, status } = req.body;
    try {
        // const EmailCheck = await employees.findOne({ where: { email: email } })
        // if (EmailCheck) {
        //     return res.json({ "Error": "Email Already Exists." })
        // }
        // const ContactCheck = await employees.findOne({ where: { contact: contact } })
        // if (ContactCheck) {
        //     return res.json({ 'Error': 'Contact Already Exists.' })
        // }
        const employee = await employees.update({ name: name, email: email, contact: contact, address: address, branch: branch, joinDate: joindate, endDate: enddate, salary: salary, department: department, status: status }, { where: { id: id } });
        return res.json({ "message": "Edited" });
    } catch (e) {
        return res.json({ "Error": e })
    }
})
router.post('/view/details', async (req, res) => {
    try {

        let { id } = req.body;
        var employeedata = await employees.findOne({ where: { id: id } });
        if (employeedata) {
            return res.json(employeedata)
        }
        else {
            return res.json({ 'Error': 'Id Not Defined' })
        }
        return res.json(false);
    }
    catch (e) {
        console.log(e);
        // res.json({'Error':''})
    }
})

module.exports = router;