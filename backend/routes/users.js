var express = require('express');
var mySqlConnection = require('../routes/mySqlConnection');
var router = express.Router();
var pool = mySqlConnection.connectionPool;

/* GET users listing. */
router.get('/', function(req, res, next) {
	pool.query('SELECT * FROM NOTES' , function( error, results, fields) {
		if(error){
			console.log(error);
			res.send(JSON.stringify(error));

		} else {
			res.send(JSON.stringify(results));
		}
	})
});

router.post('/new', function(req, res) {
	console.log(req);
    console.log("we made it!" + req.body.note + " " + req.body.date);
});

module.exports = router;
