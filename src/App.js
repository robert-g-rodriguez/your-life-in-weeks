import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      note: "",
      date: ""
    };

    this.textAreaPlaceHolder = "Enter a note about today"

    this.handleChange = this.handleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleChange(event) {
    console.log(event.target.value);
    this.setState({note: event.target.value});
  }

  handleDateChange(event) {
    console.log(event.target.value);
    this.setState({date: event.target.value});
  }

  handleSubmit(event) {
    console.log(this.state.note + " " + this.state.date);
    event.preventDefault();

    var data = {
          note: this.state.note,
          date: this.state.date
        }
    console.log(data);

    // fetch("http://localhost:3001/note/new", {
    //         method: 'POST',
    //         headers: {'Content-Type': 'application/json'},
    //         body: JSON.stringify(data)
    //     }).then(function(response) {
    //         if (response.status >= 400) {
    //           throw new Error("Bad response from server");
    //         }
    //         return response.json();
    //     }).then(function(data) {
    //         console.log(data)    
    //     }).catch(function(err) {
    //         console.log(err)
    //     });
  }

  componentDidMount() {
        let self = this;
        fetch('http://localhost:3001/note', {
            method: 'GET'
        }).then(function(response) {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        }).then(function(data) {
          var resultDate = new Date(data[0].date);
            console.log(resultDate.toLocaleDateString());
            self.setState({note: data[0].note, date: resultDate.toISOString()});
            
        }).catch(err => {
        console.log('caught it!',err);
        })
    }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload
          </p>
          <form onSubmit={this.handleSubmit}>
            <label>
              Note: <textarea value ={this.state.note} onChange={this.handleChange} placeholder={this.textAreaPlaceHolder}/>
            </label>
            <p>
              Date: <input value={this.state.date} onChange={this.handleDateChange} type="Date"/>
            </p>
            <input type="submit" value="submit" />
          </form>
        </header>
      </div>
    );
  }
}

export default App;
