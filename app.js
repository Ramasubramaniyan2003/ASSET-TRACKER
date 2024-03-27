var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { assetMaster, Admin, assetCategory, employees } = require('./models/index');
const { Op } = require('./config/db')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var app = express();
const fs = require('fs')
const employeeRouter = require('./routes/employee')
const Assets = require('./routes/assets')
const AssetCategory = require('./routes/assetcategory')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const isAuthenticate = (req, res, next) => {
    const { auth } = req.headers
    jwt.verify(auth, 'Assettracker', (err, token) => {
        if (err) {
            res.json({ 'Token': "unauthorized" })
        }
        next();
    })
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.render('login');
})
// dashboard
app.get('/dashboard', (req, res) => {
    res.render('dashboard');
})
// employee
app.use('/employee', employeeRouter)
app.use('/asset', Assets)
app.use('/asset-category', AssetCategory)
// admin login
app.post("/login", async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ where: { userName: username } });
        const match = await bcrypt.compare(password, admin.password);
        const token = jwt.sign(JSON.stringify(admin), "Assettracker")
        if (admin && match) {
            return res.json({ "success": true, "message": "admin login in", "token": token, "username": username });
        }
        else {
            return res.json({ "success": false, "message": "unauthorized user" });
        }
    }
    catch (e) {
        console.log(e);
        return res.json({ "success": false, "message": "Login Failed" });
    }
})

// // edit asset
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

// fetching employeetable data
app.post("/fetching/employeedetails", async (req, res) => {
    var employeesData = await employees.findAll()
    res.send(employeesData);
})

// fetching filtereed data
app.post("/fetching/employeedetails/statusfilter",  async (req, res) => {
    const { status } = req.body
    var employeesStatus = await employees.findAll({ where: { status: status } })
    res.send(employeesStatus);
})

app.post("/fetching/employeedetails/departmentfilter", async (req, res) => {
    const { status } = req.body
    var employeeDepartment = await employees.findAll({ where: { department: status } })
    res.send(employeeDepartment);
})
app.post("/fetching/employeedetails/branchfilter", async (req, res) => {
    const { status } = req.body
    var employeeBranch = await employees.findAll({ where: { branch: status } })
    res.send(employeeBranch);
})



app.get("/fetch/employee/filter", async (req, res) => {
    try {
        const branches = await employees.findAll({ attributes: ['branch'], group: ['branch'] })
        const department = await employees.findAll({ attributes: ['department'], group: ['department'] })
        return res.json({ branches, department });
    }
    catch (e) {
        console.log(e);
        return res.json({ "Error": e });
    }
})

// Asset Filtering
app.post("/fetching/assetdetails/statusfilter", async (req, res) => {
    const { status } = req.body
    var employeesData = await assetMaster.findAll({ where: { scrapstatus: status } })
    res.send(employeesData);
})
app.post("/fetching/assetdetails/categoryfilter", async (req, res) => {
    const { status } = req.body
    var employeesData = await assetMaster.findAll({ where: { type: status } })//change-Category-type
    res.send(employeesData);
})
// fetching assetcategory table
app.post('/fetching/assetcategory', async (req, res) => {
    try {
        const { auth } = req.headers
        var AssetCategory = await assetCategory.findAll();
        res.send(AssetCategory);
    }
    catch (e) {
        console.log(e);
    }
})

// fetching asset table details
app.post('/fetching/asset',  async (req, res) => {
    var assets = await assetMaster.findAll();
    res.send(assets);
})

// fetching asset category to view asset type
app.get('/fetching/asset/type', async (req, res) => {
    try {
        var AssetCategory = await assetCategory.findAll({ attributes: ['id', 'name'] })
        if (AssetCategory)
            return res.json({ 'data': AssetCategory })
        else
            return res.json({ 'message': 'Empty Table' })
    }
    catch (e) {
        return res.json({ 'message': 'Invalid Asset Category' })
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
app.post('/fetching/dashboard/details',  async (req, res) => {
    try {
        var activeCount = 0, inactiveCount = 0, activeAsset = 0, inactiveAsset = 0;
        var Employee = await employees.findAll({ attributes: ['id', 'status', 'branch'] })
        for (let i of Employee) {
            if (i.status == "Active") {
                activeCount++;
            }
            else { inactiveCount++; }
        }
        var totalasset = await assetMaster.findAll({ attributes: ['scrapstatus'] })
        for (let i of totalasset) {
            if (i.scrapstatus == "Active") { activeAsset++; }
            else { inactiveAsset++; }
        }
        var AssetCategory = await assetCategory.count()
        var branchescount = await employees.count({ attributes: ['branch'], group: ['branch'] })
        var assettype = await assetMaster.count({ attributes: ['type'], group: ['type'] })
        var AssetHolders = await assetMaster.findAll({ where: { employeeId: { [Op.ne]: null } } });
        var BranchCount = []
        AssetHolders.forEach((i) => {
            for (let j of Employee) {
                if (j.id == i.employeeId) {
                    BranchCount.push(j.branch)
                }
            }
        })
        res.json({ "total": Employee.length, 'activecount': activeCount, 'inactivecount': inactiveCount, 'assetcategory': AssetCategory, 'totalasset': totalasset.length, 'activeasset': activeCount, 'inactiveasset': inactiveCount, 'activeasset': activeAsset, "inactiveasset": inactiveAsset, 'branchescount': branchescount, "assettype": assettype, "BranchCount": BranchCount })
    }

    catch (e) {
        console.log(e);
        return res.json({ message: "DB error" })
    }
})

// fetching asset name
app.post('/asset-category/details/view', async (req, res) => {
    const { id } = req.body;
    try {
        const AssetCategory = await assetCategory.findOne({ where: { id: id } });
        return res.send(AssetCategory);
    }
    catch (e) {
        return res.json({ "message": "Given id is not defined!" });
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
    console.log("server started.....");
});

