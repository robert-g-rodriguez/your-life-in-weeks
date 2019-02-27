import React, {Component} from 'react';
import logo from './logo.svg';
import moment from  'moment';
// import './App.css';

const TEXTAREA_PLACEHOLDER = "Enter a note";
const HOST_AND_PORT = process.env.REACT_APP_BACKEND_HOST + ":" + process.env.REACT_APP_BACKEND_PORT + "/";
const birthdate = "1982-04-19"; //todo: get birth date from user info

class App extends Component {

    state = {
        note: "",
        date: "",
        userId: 1,
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

        fetch(HOST_AND_PORT + 'note', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then((response)=> {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        }).then((response) =>{
            data.noteId = response.noteId;
            this.setState({notes: [...this.state.notes, data]});
        }).catch( (err) => {
            console.log(err)
        });
    }

    handleUserIdChange = (event) => {
        this.setState({userId: event.target.value});
    }

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
    }

    componentDidMount() {
        this.getNotes();
    }


    render() {

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
                            <th>Life Week</th>
                        </tr>
                        {this.renderRows()}
                        </tbody>
                    </table>
                    <form onSubmit={this.handleSubmit}>
                        <h1> Add New Note: </h1>
                        <p>
                            Note: <textarea value={this.state.note} onChange={this.handleChange}
                                            placeholder={TEXTAREA_PLACEHOLDER}/>
                        </p>
                        <p>
                            Date: <input value={this.state.date} onChange={this.handleDateChange} type="Date"/>
                        </p>
                        <p>
                            User Id: <input value={this.state.userId} onChange={this.handleUserIdChange}/>
                        </p>
                        <input type="submit" value="submit"/>
                    </form>
                    {this.renderCalendar()}
                </header>
            </div>
        );
    }


    renderRows() {
        let rows;
        //todo: decide on calculate life week or store in db
        if (Array.isArray(this.state.notes)) {
            rows = this.state.notes.map((note) => <tr key={note.noteId}>
                <td>{note.note}</td>
                <td>{note.date}</td>
                <td>{note.userId}</td>
                <td>{moment(note.date).diff(birthdate,"weeks")}</td>
            </tr>)
        }
        return rows;
    }

    renderCalendar() {
        let rows = [];
        let birthday = moment(birthdate);//todo: get birthday from user info
        let nextBirthday = moment(birthdate).add(1, "year");
        let key = 0;
        for (let i = 0; i <= 100; i++) {
            let row = [];

            let thisWeek = birthday.clone();
            let nextWeek = thisWeek.clone().add(6, "days");

            while(nextWeek.isBefore(nextBirthday)){
                let weekTooltip = thisWeek.format("ddd MMM Do YYYY") + " - "
                    + nextWeek.format("ddd MMM Do YYYY");
                row.push(<span key={key} id={key++}  title={weekTooltip}>☐</span>);
                thisWeek.add(1, "week");
                nextWeek.add(1, "week");
            }

            rows.push(<tr key={key}>
                <td>{birthday.year()}-Year:{i}</td>
                <td>{row}</td>
            </tr>);
            birthday = thisWeek;
            nextBirthday.add(1,"year");



        }
        return (<table>
            <tbody>
            {rows}
            </tbody>
        </table>);
    }
}

export default App;
