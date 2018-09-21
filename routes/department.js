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
function addDepartment(req,res){
    var data = req.body
    console.log(data)
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
// function getAllUniversity(req,res){
//     res.render('layouts/department-add',{
//         title : 'Department',
//         universitys : snapshot,
//         majors      : majors,
//         page : "department"
//     });  
    // var universityRef = database.ref('university');
    // var majorRef   = database.ref('major');
    // universityRef.once('value').then(function(snapshot) {
    //     majorRef.once('value').then(function(majors){
    //         res.render('layouts/department-add',{
    //             title : 'Department',
    //             universitys : snapshot,
    //             majors      : majors,
    //             page : "department"
    //         });  
    //     })  
    // });
// }

function getAllDepartment(req,res){
    database.collection('departments').get()
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




