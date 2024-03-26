var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var multer = require('multer');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const bodyParser = require('body-parser');
const { assetMaster, Admin, assetCategory, employees, assetHistory } = require('./models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const isAuthenticate = (req, res, next) => {
    const { auth } = req.headers
    var tokenverify = jwt.verify(auth, 'Assettracker', (err, token) => {
        if (err) {
            res.json({ 'message': "unauthorized" })
            res.redirect('/');
        }
        next();
    })
}

// file upload path
const storage = multer.diskStorage({
    destination: 'images/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.filename);
    }
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.use('/users', usersRouter);
app.get('/', (req, res) => {
    res.render('login');
})
// dashboard
app.get('/dashboard', (req, res) => {
    res.render('dashboard');
})

// admin login
app.post("/login", async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ where: { userName: username } });
        const match = await bcrypt.compare(password, admin.password);
        const token = jwt.sign(JSON.stringify(admin), "Assettracker")
        if (admin && password == admin.password) {
            return res.json({ "success": true, "message": "admin login in", "token": token, "username": username });
        }
        else {
            return res.json({ "success": false, "message": "unauthorized user" });
        }
    }
    catch (e) {
        return res.json({ "success": false, "message": "db error" });
    }
})
// employee page employee master
app.get('/employee', (req, res) => {
    return res.render('employee');
})

//employee register page
app.get('/employee/register', (req, res) => {
    res.render('employeeRegister');
})
const uploadfile = multer({ storage: storage }).single('employeeimage');

//storing employee details
app.post('/employee/register/submit', uploadfile, async (req, res) => {
    const { name, email, contact, address, branch, joindate, enddate, salary, department, status } = req.body;
    try {
        const employeeinsert = await employees.create({ name: name, email: email, contact: contact, branch: branch, address: address, joinDate: joindate, endDate: enddate, salary: salary, photo: null, department: department, status })
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
// add asset category
app.post('/asset-category/add', async (req, res) => {
    try {
        const { asset } = req.body;
        const assetcategoryinsert = await assetCategory.create({ name: asset });
        return res.json({ "message": "Asset created" });
    }
    catch (e) {
        console.log("errorrr", e);
        return res.json({ "message": "error adding assetcategory" })
    }
})
// add assets
app.post('/asset/add', async (req, res) => {
    try {
        const { assetname, serial_no, model, make, scrapstatus, assettype, assetcategoryid } = req.body;
        const asset = await assetMaster.create({ name: assetname, serial_no: serial_no, model: model, make: make, scrapstatus: scrapstatus, type: assettype, assetcategoryId: assetcategoryid })
        if (asset)
            return res.json({ "message": "Asset Added" })
        else
            return res.json({ "message": "error happend!" })
    }
    catch (e) {
        console.log(e);
        return res.json({ "message": "Already exists" })
    }
})

// issue asset 
app.post('/asset/issue', async (req, res) => {
    try {
        const { employeeid, issueto, issuedate, assetid, transaction, reason } = req.body;
        const asset = await assetHistory.create({ issueto: issueto, issuedate: issuedate, assetId: assetid, transaction: transaction, reason: reason,employeeId:employeeid });
        if (asset)
            return res.json({ "message": "Asset issued!" });
        else
            return res.json({ 'message': 'Employee undefined' })
    }
    catch (e) {
        console.log(e);
        return res.json({ "message": "Enter a Values!!" });
    }
})
// history asset
app.post('/asset/history', async (req, res) => {
    try {
        const { id } = req.body
        const history = await assetHistory.findAll({ where: { assetId: id } });
        console.log('history',history);
        if (history)
            return res.send(history)
        else {
            return res.json({ "message": "false" })
        }
    }
    catch (e) {
        console.log(e);
        res.json({ 'message': 'error in searching' })
    }
})
// return asset 
app.post('/asset/return', async (req, res) => {
    try {
        const { id } = req.body;
        const returnasset = await assetHistory.findOne({ attributes: ['issueto', 'issuedate'], where: { assetId: id }, order: [['id', 'DESC']] });
        if (returnasset)
            return res.json({ "message": "sucess", "data": returnasset });
        else {
            return res.json({ "message": "Invalid Asset" });
        }
    }
    catch (e) {
        console.log(e);
        return res.json({ "message": "Invalid Asset" });
    }
})
// scrap asset
app.post('/asset/scrap/', async (req, res) => {
    try {
        const { id, reason, date, transaction } = req.body
        const asset = await assetHistory.create({ reason: reason, issuedate: date, transaction: transaction, assetId: id })
        const scrapstatus = await assetMaster.update({ scrapstatus: "Inactive" }, { where: { id: id } })
        if (asset && scrapstatus)
            return res.json({ "message": "Asset added to scrap" })
        else
            return res.json({ 'message': 'Asset not found!' })
    }
    catch (e) {
        // console.log(e);
        return res.json({ "message": "DB error" })
    }
})
app.post('/asset/service/', async (req, res) => {
    try {
        const { id, reason, transaction, fromdate, todate } = req.body

        const asset = await assetHistory.create({ reason: reason, issuedate: fromdate, transaction: transaction, assetId: id })

        const returnasset = await assetHistory.create({ issuedate: todate, transaction: 'Return service', assetId: id })
        if (asset && returnasset)
            return res.json({ "message": "Asset maintanance is added" })
        else
            return res.json({ "message": "Asset not added" })
    }
    catch (e) {
        // console.log(e);
        return res.json({ 'message': "Maintanance is not added" })
    }
})


// edit employee details
app.put('/employee/details/edit', async (req, res) => {
    const { id, name, email, contact, address, branch, joindate, enddate, salary, department, status } = req.body;
    try {
        const employee = await employees.update({ name: name, email: email, contact: contact, address: address, branch: branch, joinDate: joindate, endDate: enddate, salary: salary, department: department, status: status }, { where: { id: id } });
        return res.json({ "message": "Updated" });
    } catch (e) {
        return res.json({ "error": e })
    }
})
// edit asset category
app.put('/asset-category/details/edit', async (req, res) => {
    const { name, id } = req.body;
    try {
        const assetcategory = await assetCategory.update({ name: name }, { where: { id: id } });
        return res.json({ "message": "Asset Category Updated!" });
    }
    catch (e) {
        console.log(e);
        return res.json({ 'error': e })
    }
})
// edit asset
app.post('/asset/details/view', async (req, res) => {
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


app.put('/asset/details/edit', async (req, res) => {
    try {
        const { id, serial_no, name, model, make, scrapstatus } = req.body;
     
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
// rerturn asset
app.post('/asset/return/submit', async (req, res) => {
    try {
        const { date, reason, id, transaction, issueto } = req.body;
        const returnasset = await assetHistory.create({ issuedate: date, reason: reason, transaction: transaction, issueto: issueto, assetId: id })
      
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


// asset category
app.get('/asset-category', (req, res) => {
    res.render('assetCategory');
})
// asset master
app.get('/asset-tracker/asset-master/', (req, res) => {
    res.render('assetMaster');
})

// fetching employeetable data
app.post("/fetching/employeedetails", isAuthenticate, async (req, res) => {
    const { auth } = req.headers
    var employeesdata = await employees.findAll()
    res.send(employeesdata);
})
// fetching filtereed data
app.post("/fetching/employeedetails/filter", async (req, res) => {
    const { status } = req.body
    var employeesdata = await employees.findAll({ where: { status: status } })
    res.send(employeesdata);
})

app.post("/fetching/assetdetails/filter", async (req, res) => {
    const { status } = req.body
    var employeesdata = await assetMaster.findAll({ where: { scrapstatus: status } })
    res.send(employeesdata);
})
// fetching assetcategory table
app.post('/fetching/assetcategory', isAuthenticate, async (req, res) => {
    const { auth } = req.headers
    var assetcategory = await assetCategory.findAll();
    res.send(assetcategory);
})
// fetching asset table details
app.post('/fetching/asset', isAuthenticate, async (req, res) => {
    const { auth } = req.headers
    var assets = await assetMaster.findAll();
    res.send(assets);
})
// fetching asset category to view asset type
app.get('/fetching/asset/type', async (req, res) => {
    try {
        var assetcategory = await assetCategory.findAll({ attributes: ['id', 'name'] })
        if (assetcategory)
            return res.json({ 'data': assetcategory })
        else
            return res.json({ 'message': 'No types defined' })
    }
    catch (e) {
        return res.json({ 'message': 'DB error' })
    }
})
// fetching employee names for asset issue 
app.get('/fetching/asset/employee', async (req, res) => {
    try {
        var employee = await employees.findAll({ attributes: ['id', 'name'] })
        return res.json({ "data": employee });
    }
    catch (e) {
        console.log(e);
        return res.json({ "message": "Error fetching data in employee" })
    }
})
// fetching total employess and asset details
app.post('/fetching/dashboard/details', isAuthenticate, async (req, res) => {
    try {
        var activecount = 0, inactivecount = 0, activeasset = 0, inactiveasset = 0;
        var count = await employees.findAll({ attributes: ['status', 'branch'] })
        for (let i of count) {
            if (i.status == "Active") { activecount++; }
            else { inactivecount++; }
        }
        var totalasset = await assetMaster.findAll({ attributes: ['scrapstatus'] })
        for (let i of totalasset) {
            if (i.scrapstatus == "Active") { activeasset++; }
            else { inactiveasset++; }
        }
        var assetcategory = await assetCategory.count()
        var branchescount = await employees.count({ attributes: ['branch'], group: ['branch'] })
        var assettype = await assetMaster.count({ attributes: ['type'], group: ['type'] })

        var assetholders=await assetHistory.findAll({attributes:['employeeId']})
        
     
        res.json({ "total": count.length, 'activecount': activecount, 'inactivecount': inactivecount, 'assetcategory': assetcategory, 'totalasset': totalasset.length, 'activeasset': activecount, 'inactiveasset': inactivecount, 'activeasset': activeasset, "inactiveasset": inactiveasset, 'branchescount': branchescount, "assettype": assettype })
    }

    catch (e) {
        return res.json({ message: "DB error" })
    }
})
//fetching employeedetails
app.post('/employee/view/details', async (req, res) => {
    var { id } = req.body;
    var employeedata = await employees.findOne({ where: { id: id } });
    if (employeedata) {
        return res.json(employeedata)
    }
    return res.json(false);
})
// fetching asset name
app.post('/asset-category/details/edit', async (req, res) => {
    const { id } = req.body;
    try {
        const asset = await assetCategory.findOne({ where: { id: id } });
        return res.send(asset);
    }
    catch (e) {
        return res.json({ "message": "Given id is not defined!" });
    }
})
//fetching admin data
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username == 'admin' && password == 'admin') {
      
        return res.redirect('/employee/register');
    }
    else {
        return res.json(false);
    }
})
app.post('/employee/view/', (req, res) => {
    var { id } = req.body;
    res.send(true);
})
// fetching asset history
app.get('/asset/details/history/', async (req, res) => {
    const assethistory = await assetHistory.findAll()
    res.send(assethistory);
})
// fetching asset scrap status to hide button
app.get('/asset/scrap/status', async (req, res) => {
    try {
        const scrap = await assetMaster.findAll({ attributes: ['scrapstatus', 'id'] })
  
        res.json({ "data": scrap })
    }
    catch (e) {
        res.sendStatus(400, e);
    }
})
// delete asset category
app.delete('/asset-category/delete/', async (req, res) => {
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

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
app.listen(3000, () => {
    console.log("server started...");
});

