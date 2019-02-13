let express = require('express');
let mySqlConnection = require('../routes/mySqlConnection');
let moment = require('moment');
let router = express.Router();
let pool = mySqlConnection.connectionPool;
let promiseQuery = mySqlConnection.query;
let userId = 'userId';
let note = 'note';
let date = 'date';
let noteId = 'noteId';

function formatResults(results) {
    return results.map(note => {
        return {
            note: note.note,
            date: moment(note.date).format(moment.HTML5_FMT.DATE),
            userId: note.user_id,
            noteId: note.note_id
        }
    });
}

function query(statement, statementArguments, response) {
    const sql = mySqlConnection.mysql.format(statement, statementArguments);
    pool.query(sql, (error, results) => {
        if (error) {
            response.status(500).json(error.message);

        } else {
            response.json(formatResults(results));
        }
    });
}

function formatMissingProperties(missingProperties, response) {
    let message = "missing propert";
    if (missingProperties.length > 1) {
        message += "ies: ";
    } else {
        message += "y: ";
    }
    response.status(400).json(message + missingProperties);
}


/* GET all notes of user with id */
router.get('/:' + userId, (req, res) => {
    pool.query('SELECT * FROM NOTES WHERE USER_ID = ?', [req.params.userId], (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).json(error.message);

        } else {
            res.json(formatResults(results));
        }
    })
});


router.route('/')
    .post(function (req, res) { //new

        let missingProperties = [];

        if (!req.body.hasOwnProperty(userId)) {
            missingProperties.push(userId);
        }

        if (!req.body.hasOwnProperty(note)) {
            missingProperties.push(note);
        }

        if (!req.body.hasOwnProperty(date)) {
            missingProperties.push(date);
        } else {
            //todo:check for date format
        }

        if (missingProperties.length > 0) {
            formatMissingProperties(missingProperties, res);
        } else {
            const inserts = [req.body.userId, req.body.note, req.body.date, req.body.date];
            //check if note exists already, note exists when same date and note
            const checkStatement = "SELECT * FROM NOTES WHERE USER_ID = ? " +
                "AND NOTE = ? AND DATE = ? and LIFE_WEEK_DATE = ?";

            promiseQuery(checkStatement, inserts, [])
                .then(results => {
                    return results.length > 0;
                })
                .then(duplicateNote => {
                    if (duplicateNote) {
                        res.json("error duplicate note");
                    } else {
                        //TODO: calculate LIFE_WEEK_DATE
                        const insertStatement = "INSERT INTO notes( user_id, note, date, life_week_date) VALUES (?, ?, ?, ?)";
                        query(insertStatement, inserts, res);
                    }
                })
                .catch(error => {
                    res.status(500).json(error);
                });
        }
    })
    .put(function (request, response) { //update
        //only allow note to be changed
        let missingProperties = [];

        if (!request.body.hasOwnProperty(noteId)) {
            missingProperties.push(noteId);
        }

        if (!request.body.hasOwnProperty(note)) {
            missingProperties.push(note);
        }
        if (missingProperties.length > 0) {
            formatMissingProperties(missingProperties, response);
        } else {
            const inserts = [request.body.note, request.body.noteId];
            const updateStatement = "UPDATE NOTES SET NOTE = ? WHERE NOTE_ID = ?";
            query(updateStatement, inserts, response);
        }
    })
    .delete(function (request, response) { //delete, duh!
        //delete by note_id
        let missingProperties = [];

        if (!request.body.hasOwnProperty(noteId)) {
            missingProperties.push(noteId);
        }

        if (missingProperties.length > 0) {
            formatMissingProperties(missingProperties, response);
        } else {
            const inserts = [request.body.noteId];
            const deleteStatement = "DELETE FROM NOTES WHERE NOTE_ID = ?";
            const sql = mySqlConnection.mysql.format(deleteStatement, inserts);
            pool.query(sql, (error, results) => {
                if (error) {
                    response.status(500).json(error.message);
                } else {
                    response.status(200).json();
                }
            });
        }
    });

module.exports = router;
