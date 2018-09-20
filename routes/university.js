var express = require('express');
var router = express.Router();
var firebaseAdmin = require('../helpers/tool').firebaseAdmin;
var multer = require('../helpers/tool').multer;
var database = firebaseAdmin.firestore();
// var storage = firebaseAdmin.storage();
var university = require('../models/university');
// var UUID = require('uuid/v4');
// var getJSON = require('get-json');
// var request = require("request")

router.get('/university', function (req, res) {
    res.render('layouts/university', {
                title: 'University',
                page: 'university'
               // universitys: snapshot
    });
    // var universityRef = database.ref('university');
    // universityRef.once('value').then(function (snapshot) {
    //     res.render('layouts/university', {
    //         title: 'University',
    //         page: 'university',
    //         universitys: snapshot
    //     });
    // });
})
router.post('/university', function (req, res) {
    res.redirect('/university');
})
router.get('/university-add', function (req, res) {
    res.render('layouts/university-add', {
        title: 'Add University',
        page: 'university'
    });
})
router.post('/university-add', multer.any(), function (req, res) {
    addUniversity(req, res);
})
// router.post('', function (req, res) {
//     res.redirect('/university-edit-:universityId');
// })

function addUniversity(req, res) {
    var data = req.body
    var universityRef = database.collection('universitys')
    university.id  =  universityRef.doc().id
    university.logo = ""
    university.name_en = data.name_en
    university.name_kh = data.name_kh
    universityRef.doc(university.id).set({
        "university" : university.id
    })
    // universityRef.child(university.id).set(university).then(function(){
    //     multipleImageCheck(req,university.id);
    // });
    res.redirect('/university-add');
}

function uploadImage(file,id) {
    let uuid = UUID();
    //console.log(file.originalname);
    var imageBuffer = Buffer.from(file.buffer, 'base64');
    var bucket = storage.bucket();
    let fileName = `${callForm}/${new Date().getTime() + file.originalname}`;
    var uploadImage = bucket.file(fileName);
    uploadImage.save(imageBuffer, {
        metadata: {
            contentType: file.mimetype,
            metadata: {
                firebaseStorageDownloadTokens: uuid
            }
        },
    }, function (error) {
        if (error) {
            console.log('Unable to upload the image.');
        } else {
            console.log('Uploaded');
            const imgUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/`
                + encodeURIComponent(fileName)
                + '?alt=media&token='
                + uuid;
            console.log('URL', imgUrl);
            addImageUrlToDatabase(id,imgUrl)
        }
    });
}
function addImageUrlToDatabase(id,imgUrl){
    var imageRef = database.ref('university').child(id);
    imageRef.child('logo').set(imgUrl).then(function(){
        console.log("logo add");
    });
}

module.exports = router


// router.get('/university/edit/:universityId',function(req,res){
//   var universityId = req.params.universityId;
//   var universityRef = database.ref('university');
//   universityRef.child(universityId).once('value').then(function(snapshot) {
//       if(snapshot.val()!=undefined){
//         res.render('layouts/university.edit.ejs',{
//             title : 'Edit University',
//             university : snapshot
//         });
//       }else{
//           res.redirect('/');
//       }
//   }); 
// })