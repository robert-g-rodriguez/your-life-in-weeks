let express = require('express');
let mySqlConnection = require('../routes/mySqlConnection');
let moment = require('moment');
let router = express.Router();
let pool = mySqlConnection.connectionPool;

/* GET all dates */
router.get('/', (req, res) => {

	pool.query('SELECT * FROM NOTES' , (error, results) => {
		if(error){
			console.log(error);
			res.send(JSON.stringify(error));

		} else {
			res.send(JSON.stringify(results.map(note => {
				return {
					note: note.note,
					date: moment(note.date).format(moment.HTML5_FMT.DATE)
				}
			})));
		}
	})
});

//todo: create new notes
router.post('/new', function(req, res) {
    console.log("we made it!" + req.body.note + " " + req.body.date);
});

module.exports = router;
