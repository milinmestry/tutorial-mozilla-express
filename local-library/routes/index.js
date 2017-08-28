var express = require('express');
var router = express.Router();


/**
 * mLAB DB user
 * user: local_library_root
 * pass: locallibraryROOT
 */
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express your code' });
});

module.exports = router;
