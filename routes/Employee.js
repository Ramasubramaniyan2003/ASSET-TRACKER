const express = require('express')
const router = express.Router()
const { employees } = require('../models/index');
const jwt = require('jsonwebtoken')

function authenticate(req, res, next) {
    const { auth } = req.headers
    jwt.verify(auth, 'Assettracker', (err, token) => {
        if (err) {
            res.json({ 'message': "unauthorized" })
        }
        next();
    })
}
function validate(req, res, next) {
    const { name, email, contact, address, joindate, salary, branch, department, status } = req.body
    if (!name) {
        return res.json({ 'Error': 'Name field is required.' })
    }
    if (!email) {
        return res.json({ 'Error': 'Email field is required.' })
    }
    if (!contact) {
        return res.json({ 'Error': 'Contact field is required.' })
    }
    if (!address) {
        return res.json({ 'Error': 'Address field is required.' })
    }
    if (!branch) {
        return res.json({ 'Error': 'Branch field is required.' })
    }
    if (!joindate) {
        return res.json({ 'Error': 'Join Date field is required.' })
    }
    if (!salary) {
        return res.json({ 'Error': 'Salary field is required.' })
    }
    if (!department) {
        return res.json({ 'Error': 'Department field is required.' })
    }
    if (!status) {
        return res.json({ 'Error': 'Status field is required.' })
    }
    if (!(contact.match(/^[1-9]{1}[0-9]{9}$/))) {
        if (contact.length < 10) {
            return res.json({ 'Error': "The phone number should be 10 digits." })
        }
        return res.json({ 'Error': contact + "Invalid Number" })
    }
    next();
}

router.get('/', (req, res) => {
    return res.render('employee');
})
router.get('/register', (req, res) => {
    res.render('employeeRegister');
})

router.post('/register/submit', authenticate, validate, async (req, res) => {

    try {
        const { name, email, contact, address, branch, joindate, enddate, salary, department, status } = req.body;
        const emailCheck = await employees.findOne({ where: { email: email } })
        if (emailCheck) {
            return res.json({ "Error": "Email Already Exists" })
        }
        const employeeInsert = await employees.create({ name: name, email: email, contact: contact, branch: branch, address: address, joinDate: joindate, endDate: enddate, salary: salary, department: department, status })
        if (employeeInsert) {
            return res.json({ "success": "true" });
        }
        else {
            return res.json({ "Error": "Error" })
        }
    }
    catch (e) {
        console.log(e);
        return res.send({ success: false });
    }
})
router.put('/details/edit', authenticate, validate, async (req, res) => {
    const { id, name, email, contact, address, branch, joindate, enddate, salary, department, status } = req.body;
    try {
        const employee = await employees.update({ name: name, email: email, contact: contact, address: address, branch: branch, joinDate: joindate, endDate: enddate, salary: salary, department: department, status: status }, { where: { id: id } });
        return res.json({ "message": "Edited" });
    } catch (e) {
        console.log(e);
        return res.json({ "Error": e })
    }
})
router.post('/view/details', authenticate, async (req, res) => {
    try {
        let { id } = req.body;
        var employeeData = await employees.findOne({ where: { id: id } });
        if (employeeData) {
            return res.json(employeeData)
        }
        else {
            return res.json({ 'Error': 'Id Not Defined' })
        }
    }
    catch (e) {
        console.log(e);
        res.json({ 'Error': e })
    }
})

module.exports = router;