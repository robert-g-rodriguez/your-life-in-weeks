import React, {Component} from 'react';
import logo from './logo.svg';
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
            this.setState({
                notes: data
            });

        }).catch(err => {
            console.log('caught it!', err);
        })
    };

    handleNewNote = (data) => {
        this.setState({notes: [...this.state.notes, data]});
    }

    componentDidMount() {
        this.getNotes();
    }


    render() {

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <NoteList notes={this.state.notes} birthdate={birthdate}/>
                    <NoteForm onNotesChange={this.handleNewNote} hostAndPort={HOST_AND_PORT}/>
                    <Calendar birthdate={birthdate}/>
                </header>
            </div>
        );
    }
}

export default App;
