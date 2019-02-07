let express = require('express');
let mySqlConnection = require('../routes/mySqlConnection');
let moment = require('moment');
let router = express.Router();
let pool = mySqlConnection.connectionPool;
let promiseQuery = mySqlConnection.query;

function query(sql, response) {
    pool.query(sql, (error, results) => {
        if (error) {
            response.send(JSON.stringify(error));

        } else {
            response.send(JSON.stringify("success"));
        }
    });
}

/* GET all notes of user with id */
router.get('/:user_id', (req, res) => {
    pool.query('SELECT * FROM NOTES WHERE USER_ID = ?', [req.params.user_id], (error, results) => {
        if (error) {
            console.log(error);
            res.send(JSON.stringify(error));

        } else {
            res.send(JSON.stringify(results.map(note => {
                return {
                    note: note.note,
                    date: moment(note.date).format(moment.HTML5_FMT.DATE),
                    userId: note.user_id,
                    noteId: note.note_id
                }
            })));
        }
    })
});

router.route('/')
    .post(function (req, res) { //new
        const inserts = [req.body.userId, req.body.note, req.body.date, req.body.date];

        //check if note exists already, note exists when same date and note
        const checkStatement = "SELECT * FROM NOTES WHERE USER_ID = ? " +
            "AND NOTE = ? AND DATE = ? and LIFE_WEEK_DATE = ?";
        const sqlCheck = mySqlConnection.mysql.format(checkStatement, inserts);


        promiseQuery(sqlCheck, [])
            .then(results => {
                return results.length > 0;
            })
            .then(duplicateNote => {
                if (duplicateNote) {
                    res.send(JSON.stringify("error duplicate note"));
                } else {
                    //TODO: calculate LIFE_WEEK_DATE
                    const insertStatement = "INSERT INTO notes( user_id, note, date, life_week_date) VALUES (? , ?, ?, ?)";

                    const sql = mySqlConnection.mysql.format(insertStatement, inserts);
                    query(sql, res);
                }
            }).catch(error => {
            res.send(JSON.stringify(error));
        });
    })
    .put(function (request, response) { //update
        //only allow note to be changed
        const inserts = [request.body.note, request.body.noteId];
        const updateStatement ="UPDATE NOTES SET NOTE = ? WHERE NOTE_ID = ?";
        const sql = mySqlConnection.mysql.format(updateStatement, inserts);
        query(sql, response);
    })
    .delete(function (request, response) { //delete, duh!
        //delete by note_id
        const inserts = [request.body.noteId];
        const deleteStatement = "DELETE FROM NOTES WHERE NOTE_ID = ?";
        const sql = mySqlConnection.mysql.format(deleteStatement, inserts);
        query(sql, response);
    });

module.exports = router;
