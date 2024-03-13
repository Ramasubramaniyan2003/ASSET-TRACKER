var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var multer = require('multer');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const bodyParser = require('body-parser');
const { employees } = require('./models/index');
const { Admin } = require('./models/index');
const {assetCategory}=require('./models/index');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// admin login
app.post("/login", async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ where: { userName: username } });
        console.log(admin);
        if (admin) {
            return res.json({ "success": true, "message": "admin login in" });
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

//view page for employee
// app.get('/employee/view', (req, res) => {
//     res.render('employeeview');
// })
// edit employee
// app.post('/employee/edit',async (req,res)=>{
//     const {id}=req.body;
//     console.log("put",id);
//     var employee= await employees.findOne 
//     res.send(true)
// })
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
app.post('/asset-category/add', async(req,res)=>{
    try{
    const {asset}=req.body;
    const assetcategoryinsert= await assetCategory.create({name:asset});
    return res.json({"message":"Asset created"});
    }
    catch(e){
        console.log("errorrr",e);
        return res.json({"message":"error adding assetcategory"})
    }
})
// edit asset category



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
app.put('/asset-category/details/edit',async (req,res)=>{
          const {name,id}=req.body;
          try{
            console.log(id);
            const assetcategory=await assetCategory.update({name:name},{where:{id:id}});
            return res.json({"message":"Asset Category Updated!"});
          }
          catch(e){
            console.log(e);
            return res.json({'error':e})
          }
})
// asset category
app.get('/asset-category', (req,res)=>{
    res.render('assetCategory');
})
// fetching table data
app.get("/fetching/employeedetails", async (req, res) => {
    var employeesdata = await employees.findAll()
    res.send(employeesdata);
})
// fetching assetcategory table
app.get('/fetching/assetcategory',async(req,res)=>{
   var assetcategory=await assetCategory.findAll();
    res.send(assetcategory);
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
app.post('/asset-category/details/edit',async(req,res)=>{
    const {id}=req.body;
    try{
        const asset=await assetCategory.findOne({where:{id:id}});
        return res.send(asset);
    }
    catch(e){
        return res.json({"message":"Given id is not defined!"});
    }
})
//fetching admin data
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username == 'admin' && password == 'admin') {
        console.log('called');
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
// delete asset category
app.delete('/asset-category/delete/',async (req,res)=>{
    var {id}=req.body;
   try{
    var asset= await assetCategory.destroy({where:{id:id}});
    if(asset){
        return res.json({"message":"Deleted !"});
    }
   }
   catch(e){
    return res.json({"message":"id is not defined"});
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

// app buttons wanna create