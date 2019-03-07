import React, {Component} from 'react';
import logo from './logo.svg';
import moment from 'moment';
import NoteList from './NoteList';
import Calendar from './Calendar';
import NoteForm from './NoteForm';

const HOST_AND_PORT = process.env.REACT_APP_BACKEND_HOST + ":" + process.env.REACT_APP_BACKEND_PORT + "/";
const birthdate = "1984-03-12"; //todo: get birth date from user info

class App extends Component {

    state = {
        notes: []
    };

    getNotes = () => {
        fetch(HOST_AND_PORT + 'note/1', { //todo: change from hardcoded user id
            method: 'GET'
        }).then((response) => {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        }).then((data) => {
            if (!data) {
                return;
            }
            data.sort(this.sortByDate);
            data.forEach(note => {note.lifeWeek = moment(note.date).diff(birthdate, "weeks")});
            this.setState({
                notes: data
            });

        }).catch(err => {
            console.log('caught it!', err);
        })
    };

    handleNewNote = (data) => {
        data.lifeWeek = moment(data.date).diff(birthdate, "weeks")
        let sortedNotes = [...this.state.notes, data];
        sortedNotes.sort(this.sortByDate);
        this.setState({notes: sortedNotes});
    };

    sortByDate = (first, second) => {
        return new Date(first.date) - new Date(second.date)
    };

    componentDidMount() {
        this.getNotes();
    }


    render() {

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <NoteList notes={this.state.notes} />
                    <NoteForm onNotesChange={this.handleNewNote} hostAndPort={HOST_AND_PORT}/>
                    <Calendar birthdate={birthdate} notes={this.state.notes}/>
                </header>
            </div>
        );
    }
}

export default App;
