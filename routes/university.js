var express = require('express')
var router = express.Router()
var firebaseAdmin = require('../helpers/tool').firebaseAdmin
var multer = require('../helpers/tool').multer
const database = firebaseAdmin.firestore()
database.settings({ timestampsInSnapshots: true })
const storage = firebaseAdmin.storage()
var UUID = require('uuid/v4');

router.get('/university', function (req, res) {
    database.collection('universitys').get()
        .then(snapshot => {
           console.log(snapshot)
            res.render('layouts/university', {
                title       : 'University',
                page        : 'university',
                universitys : snapshot
            });
        })
        .catch(err => {
            console.log(err)
            res.redirect('/')
        });
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
function addUniversity(req,res) {
    var file = req.files[0]
    let uuid = UUID()
    var imageBuffer = Buffer.from(file.buffer, 'base64')
    var bucket = storage.bucket()
    let fileName = `logo/${new Date().getTime() + file.originalname}`
    var uploadImage = bucket.file(fileName)
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
            saveUniversity(req,res,imgUrl)
        }
    });
}

function saveUniversity(req, res,logo_url) {
    var data = req.body
    var universityRef = database.collection('universitys')
    var university = {
        id : universityRef.doc().id,
        name_en : data.name_en,
        name_kh : data.name_kh,
        website : data.website,
        logo    : logo_url
    }
    universityRef.doc(university.id).set(university).then(function(){
        res.redirect('/university-add')
    }).catch(function(error){
        console.error("Error writing document: ", error)
    })
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