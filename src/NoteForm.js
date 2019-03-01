import React, {Component} from 'react';

const TEXTAREA_PLACEHOLDER = "Enter a note";

class NoteForm extends Component {

    state = {
        note:"",
        date:"",
        userId:1
    }

    handleSubmit = (event) => {
        event.preventDefault();
        //TODO: validation
        let data = {
            note: this.state.note,
            date: this.state.date,
            userId: this.state.userId
        }

        fetch(this.props.hostAndPort + 'note', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then((response) => {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        }).then((response) => {
            data.noteId = response.noteId;
            this.props.onNotesChange(data);
        }).catch((err) => {
            console.log(err)
        });
    }

    handleUserIdChange = (event) => {
        this.setState({userId: event.target.value});
    }

    handleChange = (event) => {
        this.setState({note: event.target.value});
    }

    handleDateChange = (event) => {
        this.setState({date: event.target.value});
    }

    render() {
        return (
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
        );
    }
}

export default NoteForm;