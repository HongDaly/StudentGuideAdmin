var express = require('express');
var router = express.Router();
var firebaseAdmin = require('../helpers/tool').firebaseAdmin;
var database = firebaseAdmin.firestore()
var multer = require('../helpers/tool').multer

router.get('/department',function(req,res){
    getAllDepartment(req,res);
})
router.post('/department',function(req,res){
    res.redirect('/department');
})
router.get('/department-add',function(req,res){
    database.collection('majors').get()
        .then(snapshot => {
           console.log(snapshot)
            res.render('layouts/department-add',{
                title : 'Department',
                page : "department",
                majors : snapshot
            }); 
        })
        .catch(err => {
            console.log(err)
            res.redirect('/')
        });
})
router.post('/department-add',multer.any(),function(req,res){
    addDepartment(req,res);
})
router.get('/department-edit/:id',function(req,res){
    database.collection('majors').get()
    .then(majors => {
        database.collection('departments').doc(req.params.id).get().then(department => {
            res.render('layouts/department-edit',{
                title : 'Department',
                page : "department",
                majors :majors,
                department :department
            }); 
        }).catch(err => {
            console.log(err)
            res.redirect('/')
        })
    })
    .catch(err => {
        console.log(err)
        res.redirect('/')
    });
})
router.post('/department-edit/:id',multer.any(),function(req,res){
    updateDepartment(req,res)
})
router.get('/department-delete/:id',function(req,res){
    deleteDepartment(req,res)
})
function deleteDepartment(req,res){
    database.collection('departments').doc(req.params.id).delete()
    .then(function(){
        res.redirect('/department')
    }).catch(function(){
        console.log(err)
        res.redirect('/')
    })
}
function updateDepartment(req ,res){
    var data = req.body
    console.log(data)
    var department = {
        name_en : data.name_en,
        name_kh : data.name_kh,
        sub_recomment : data.sub_recomment
    }
    database.collection('departments').doc(req.params.id).update(department).then(function(){
        res.redirect('/department');
    }).catch(function(err){
        console.error("Error writing document: ", err)
    })
}
function addDepartment(req,res){
    var data = req.body
    var departmentRef = database.collection('departments')
    var department = {
        id : departmentRef.doc().id,
        name_en : data.name_en,
        name_kh : data.name_kh,
        sub_recomment : data.sub_recomment
    }
    departmentRef.doc(department.id).set(department).then(function(){
        res.redirect('/department-add');
    }).catch(function(error){
        console.error("Error writing document: ", error)
    })
}

function getAllDepartment(req,res){
    database.collection('departments').orderBy('name_kh').get()
    .then(snapshot => {
        res.render('layouts/department',{
            title : 'Department',
            departments : snapshot,
            page : "department"
        }); 
    })
    .catch(err => {
        console.log(err)
        res.redirect('/')
    });
}
module.exports = router




