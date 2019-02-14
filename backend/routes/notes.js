let express = require('express');
let mySqlConnection = require('../routes/mySqlConnection');
let moment = require('moment');
let router = express.Router();
let pool = mySqlConnection.connectionPool;
let promiseQuery = mySqlConnection.query;
const userId = 'userId';
const note = 'note';
const date = 'date';
const noteId = 'noteId';

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

function formatMissingPropertiesResponse(missingProperties, response) {
    let message = "missing propert" + ((missingProperties.length > 1) ? "ies: " : "y: ");
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
    .post(function (request, response) { //new
        let requiredProperties = [userId, note, date];
        let missingProperties = requiredProperties.filter((property) => !request.body.hasOwnProperty(property));
        //todo: check for proper date format

        if (missingProperties.length > 0) {
            formatMissingPropertiesResponse(missingProperties, response);
        } else {
            const inserts = [request.body.userId, request.body.note, request.body.date, request.body.date];
            //check if note exists already, note exists when same date and note
            const checkStatement = "SELECT * FROM NOTES WHERE USER_ID = ? " +
                "AND NOTE = ? AND DATE = ? and LIFE_WEEK_DATE = ?";

            promiseQuery(checkStatement, inserts, [])
                .then(results => {
                    return results.length > 0;
                })
                .then(duplicateNote => {
                    if (duplicateNote) {
                        response.json("error duplicate note");
                    } else {
                        //TODO: calculate LIFE_WEEK_DATE
                        const insertStatement = "INSERT INTO notes( user_id, note, date, life_week_date) VALUES (?, ?, ?, ?)";
                        query(insertStatement, inserts, response);
                    }
                })
                .catch(error => {
                    response.status(500).json(error);
                });
        }
    })
    .put(function (request, response) { //update
        //only allow note to be changed
        let requiredProperties = [noteId, note];
        let missingProperties = requiredProperties.filter((property) => !request.body.hasOwnProperty(property));

        if (missingProperties.length > 0) {
            formatMissingPropertiesResponse(missingProperties, response);
        } else {
            const inserts = [request.body.note, request.body.noteId];
            const updateStatement = "UPDATE NOTES SET NOTE = ? WHERE NOTE_ID = ?";
            query(updateStatement, inserts, response);
        }
    })
    .delete(function (request, response) { //delete, duh!
        //delete by note_id
        let requiredProperties = [noteId];
        let missingProperties = requiredProperties.filter((property) => !request.body.hasOwnProperty(property));

        if (missingProperties.length > 0) {
            formatMissingPropertiesResponse(missingProperties, response);
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
