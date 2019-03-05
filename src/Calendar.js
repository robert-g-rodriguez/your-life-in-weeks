import React, {Component} from 'react';
import moment from 'moment';

class Calendar extends Component {

    state = {
        isFiftyTwoWeeks: false
    };

    handleWeeksChange = (event) => {
        this.setState({isFiftyTwoWeeks: event.target.value === 'true'})
    };

    render() {
        console.log('rendering Calendar');

        let rows = [];
        let birthday = moment(this.props.birthdate);//todo: get birthday from user info
        let thisWeek = birthday.clone();
        let nextBirthday = moment(this.props.birthdate).add(1, "year");
        let key = 0;
        let notesCopy = this.props.notes.slice();

        for (let i = 0; i <= 100; i++) {
            let row = [];

            let nextWeek = thisWeek.clone().add(6, "days");
            for (let j = 0; this.state.isFiftyTwoWeeks ? j < 52 : nextWeek.isBefore(nextBirthday); j++) {
                let weekTooltip = thisWeek.format("ddd MMM Do YYYY") + " - "
                    + nextWeek.format("ddd MMM Do YYYY");
                let nonBirthdayIcon = '☐';
                if (notesCopy.length > 0 && notesCopy[0].lifeWeek === key) {
                    nonBirthdayIcon = 'x';
                    while (notesCopy[0].lifeWeek === key) {
                        notesCopy.shift()
                    }
                }
                let weekIcon = birthday.isBetween(thisWeek, nextWeek, null, '[]')
                    ? '🎂'
                    : nonBirthdayIcon;

                row.push(<span key={key} id={key++} title={weekTooltip}>{weekIcon}</span>);
                thisWeek.add(1, "week");
                nextWeek.add(1, "week");
            }

            rows.push(<tr key={key}>
                <td>{birthday.year()}-Year:{i}</td>
                <td>{row}</td>
            </tr>);
            birthday = nextBirthday.clone();
            nextBirthday.add(1, "year");
        }

        return (
            <>
                <select value={this.state.isFiftyTwoWeeks} onChange={this.handleWeeksChange}>
                    <option value='true'>true</option>
                    <option value='false'>false</option>
                </select>
                <table>
                    <tbody>
                    {rows}
                    </tbody>
                </table>
            </>
        );
    }
}

export default Calendar;