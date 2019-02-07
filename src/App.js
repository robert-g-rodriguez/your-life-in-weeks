import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

    state = {
        note: "",
        date: "",
        userId: 0
    };

    textAreaPlaceHolder = "Enter a note about today"

    handleChange = (event) => {
        console.log(event.target.value);
        this.setState({note: event.target.value});
    }

    handleDateChange = (event) => {
        console.log(event.target.value);
        this.setState({date: event.target.value});
    }

    handleSubmit = (event) => {
        console.log(this.state.note + " " + this.state.date);
        event.preventDefault();

        let data = {
            note: this.state.note,
            date: this.state.date,
            userId: this.state.userId
        }
        console.log(data);


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
            //todo: handle duplicate result
            console.log(data)
        }).catch(function (err) {
            console.log(err)
        });
    }

    handleUserIdChange = (event) => {
        console.log(event.target.value);
        this.setState({userId: event.target.value});
    }

    componentDidMount() {
        let self = this;
        //todo: change url to get using id instead of hardcoded '1'
        fetch('http://localhost:3001/note/1', {
            method: 'GET'
        }).then(function (response) {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        }).then(function (data) {//todo: fix for no data returned and multiple entries
            console.log(data[0].date);
            self.setState({
                note: data[0].note,
                date: data[0].date,
                userId: data[0].userId
            });

        }).catch(err => {
            console.log('caught it!', err);
        })
    }


    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <p>
                        Edit <code>src/App.js</code> and save to reload
                    </p>
                    <form onSubmit={this.handleSubmit}>
                        <p>
                            Note: <textarea value={this.state.note} onChange={this.handleChange}
                                            placeholder={this.textAreaPlaceHolder}/>
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
