var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var engine = require('ejs-layout')

//set static path
var path = require('path')
app.use(express.static(path.join(__dirname,'assets')))

//view engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'resources'))
app.engine('ejs',engine.__express);

// get router
var indexRouter = require('./routes/index')
var universityRouter = require('./routes/university')
var departmentRouter = require('./routes/department')
// use router
app.use(indexRouter)
app.use(universityRouter)
app.use(departmentRouter)

//body-parser
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

//set up server
app.listen(3000,function(){
    console.log("Server running on port 3000 ... ")
});
