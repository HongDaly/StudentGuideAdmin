var firebaseAdmin = require('firebase-admin');
var multerRoot = require('multer');
var serviceAccount = require('../helpers/studentguide-dd1a6-firebase-adminsdk-iymb7-ba8cd70300.json');
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: 'https://studentguide-dd1a6.firebaseio.com',
    storageBucket :'studentguide-dd1a6.appspot.com'
});
var multer = multerRoot({
    storage: multerRoot.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024
    }
});
module.exports = {firebaseAdmin:firebaseAdmin,multer:multer}