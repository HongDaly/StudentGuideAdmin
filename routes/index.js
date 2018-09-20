var express = require('express');
var router = express.Router();
router.get('/',function(req,res){
    res.render('layouts/dashboard',{
        title : 'Dashboard',
        page  : 'dashboard'
    });
})

router.post('/',function(req,res){
    res.redirect('/');
})
module.exports = router