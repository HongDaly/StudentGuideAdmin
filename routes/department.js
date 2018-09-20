var express = require('express');
var router = express.Router();
var firebaseAdmin = require('../tools/firebase-admin-init').firebaseAdmin;
var database = firebaseAdmin.database();

var multer = require('../tools/firebase-admin-init').multer;
var department = require('../models/department');

router.get('/department',function(req,res){
    getAllDepartment(req,res);
})
router.post('/department',function(req,res){
    res.redirect('/department');
})
router.get('/department-add',function(req,res){
    getAllUniversity(req,res);
})
router.post('/department-add',multer.any(),function(req,res){
    addDepartment(req,res);
})
function getAllUniversity(req,res){
    var universityRef = database.ref('university');
    var majorRef   = database.ref('major');
    universityRef.once('value').then(function(snapshot) {
        majorRef.once('value').then(function(majors){
            res.render('layouts/department-add',{
                title : 'Department',
                universitys : snapshot,
                majors      : majors,
                page : "department"
            });  
        })  
    });
}
function addDepartment(req,res){
    var data = req.body;
    var departmentRef = database.ref('department');
    department.id = departmentRef.push().key;
    department.faculty_id = data.faculty;
    department.university_id = data.university;
    department.name_en = data.name_en;
    department.name_kh = data.name_kh;
    department.price = data.price;
    department.sub_recommant = data.sub_recomment;

    departmentRef.child(department.id).set(department).then(function(){
        res.redirect('/department-add');
    });
}
function getAllDepartment(req,res){
    var departmentRef = database.ref('department').once('value').then(function(snapshot){
        res.render('layouts/department',{
            title : 'Department',
            departments : snapshot,
            page : "department"
        }); 
    })
}
module.exports = router