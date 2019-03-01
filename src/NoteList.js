import React, {Component} from 'react';
import moment from 'moment';

class NoteList extends Component {

    render() {
        return (
            <table>
                <tbody>
                <tr>
                    <th>note</th>
                    <th>date</th>
                    <th>userId</th>
                    <th>Life Week</th>
                </tr>
                {this.renderRows()}
                </tbody>
            </table>
        );
    }

    renderRows() {
        let rows;
        //todo: decide on calculate life week or store in db
        const notes = this.props.notes;
        if (Array.isArray(notes)) {
            rows = notes.map((note) => <tr key={note.noteId}>
                <td>{note.note}</td>
                <td>{note.date}</td>
                <td>{note.userId}</td>
                <td>{moment(note.date).diff(this.props.birthdate, "weeks")}</td>
            </tr>)
        }
        return rows;
    }
}

export default NoteList;