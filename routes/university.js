var express = require('express')
var router = express.Router()
var firebaseAdmin = require('../helpers/tool').firebaseAdmin
var multer = require('../helpers/tool').multer
const database = firebaseAdmin.firestore()
database.settings({ timestampsInSnapshots: true })
const storage = firebaseAdmin.storage()
var UUID = require('uuid/v4')
var request = require('request')

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
    res.redirect('/university')
})
router.get('/university-add', function (req, res) {
    var url="http://battuta.medunes.net/api/region/kh/all/?key=dccb82e7f0a798119726d081d956bcde";
    request({
        url: url,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.render('layouts/university-add', {
                title: 'Add University',
                page: 'university',
                cities : body
            });
        }else{
            res.redirect('/university');
        }
    })
})
router.post('/university-add', multer.any(), function (req, res) {
   addUniversity(req, res)
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
    var contact = {
        address : data.address,
        email   : data.email,
        website : data.website,
        fb_page : data.fb_page,
        phone   : data.phone
    }
    var geography = {
        city           :  data.city,
        location       :  {
            lat        :  data.location_lat,
            long       :  data.location_long
        },
        library        : data.library,
        sport_facility : data.sport_facility
    }
    var university = {
        id          : universityRef.doc().id,
        name_en     : data.name_en,
        name_kh     : data.name_kh,
        name_abbr   : data.name_abbr,
        logo        : logo_url,
        contact     : contact,
        geography   : geography
    }

    universityRef.doc(university.id).set(university).then(function(){
        res.redirect('/university-add')
    }).catch(function(error){
        console.error("Error writing document: ", error)
    })
}
module.exports = router