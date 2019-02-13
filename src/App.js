import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

const textAreaPlaceHolder = "Enter a note";

class App extends Component {

    state = {
        note: "",
        date: "",
        userId: 0,
        notes: []
    };

    handleChange = (event) => {
        this.setState({note: event.target.value});
    }

    handleDateChange = (event) => {
        this.setState({date: event.target.value});
    }

    handleSubmit = (event) => {
        event.preventDefault();

        let data = {
            note: this.state.note,
            date: this.state.date,
            userId: this.state.userId
        }
        console.log(data);

        const self = this;
        //todo: change addresses to environmental variables
        fetch("http://localhost:3001/note", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then(function (response) {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        }).then(function (data) {
            self.setState({notes:[...self.state.notes, data]})
        }).catch(function (err) {
            console.log(err)
        });
    }

    handleUserIdChange = (event) => {
        this.setState({userId: event.target.value});
    }

    componentDidMount() {
        this.getNotes()
    }

    getNotes(){
        const self = this;
        //todo: change url to get using id instead of hardcoded '1'
        fetch('http://localhost:3001/note/2', {
            method: 'GET'
        }).then(function (response) {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        }).then(function (data) {//todo: fix for no data returned and multiple entries
            if (!data) {
                return;
            }
            self.setState({
                notes: data
            });

        }).catch(err => {
            console.log('caught it!', err);
        })
    }


    render() {
        let rows;
        if(Array.isArray(this.state.notes)) {
            rows = this.state.notes.map((note) => <tr key={note.noteId}>
                <td>{note.note}</td>
                <td>{note.date}</td>
                <td>{note.userId}</td>
            </tr>)
        }


        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <table>
                        <tbody>
                        <tr>
                            <th>note</th>
                            <th>date</th>
                            <th>userId</th>
                        </tr>
                        {rows}
                        </tbody>
                    </table>
                    <form onSubmit={this.handleSubmit}>
                        <h1> Add New Note: </h1>
                        <p>
                            Note: <textarea value={this.state.note} onChange={this.handleChange}
                                            placeholder={textAreaPlaceHolder}/>
                        </p>
                        <p>
                            Date: <input value={this.state.date} onChange={this.handleDateChange} type="Date"/>
                        </p>
                        <p>
                            User Id: <input value={this.state.userId} onChange={this.handleUserIdChange}/>
                        </p>
                        <input type="submit" value="submit"/>
                    </form>
                </header>
            </div>
        );
    }


}

export default App;
