import React from "react";
import {DayPicker} from "react-day-picker";
import 'react-day-picker/lib/style.css';

const nonWorkDaysStyle = `.DayPicker-Day--nonWorkDays {
  background-color: red;
  color: white;
}`;

class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.nonWorkDays = this.nonWorkDays.bind(this);
        this.state = {
            selectedDays: [],
            nonWorkDays: [],
            nonWorkDaysTime: []
        }
    }

    handleDayClick(day, {selected}) {
        if (this.props.nonWorkDaysSelectionRegime) {
            if (!~this.state.nonWorkDaysTime.indexOf(day.getTime())) {
                this.setState({
                        nonWorkDays: this.state.nonWorkDays.concat([day]),
                        nonWorkDaysTime: this.state.nonWorkDaysTime.concat([day.getTime()])
                    },
                    () => {
                        localStorage.setItem('nonWorkDays', JSON.stringify(this.state.nonWorkDays));
                        localStorage.setItem('nonWorkDaysTime', JSON.stringify(this.state.nonWorkDaysTime));
                    });
            } else {
                this.setState({
                        nonWorkDays: this.state.nonWorkDays.filter((alreadySelectedDay) => {
                            if (alreadySelectedDay.getTime) {
                                return alreadySelectedDay.getTime() !== day.getTime();
                            }
                            return new Date(alreadySelectedDay).getTime() !== day.getTime();
                        }),
                        nonWorkDaysTime: this.state.nonWorkDaysTime.filter((alreadySelectedDayTime) => {
                            return alreadySelectedDayTime !== day.getTime();
                        })
                    },
                    () => {
                        localStorage.setItem('nonWorkDays', JSON.stringify(this.state.nonWorkDays));
                        localStorage.setItem('nonWorkDaysTime', JSON.stringify(this.state.nonWorkDaysTime));
                    });
            }
        } else {
            if (~this.props.daysToSelect.indexOf(day.getDay())) {
                let resultDays = [];
                if (this.props.daysToSelect.length) {
                    while (resultDays.length < this.props.countOfTrainings) {
                        let stampDay = new Date(day.getTime());

                        if (~this.props.daysToSelect.indexOf(stampDay.getDay())) {
                            resultDays.push(stampDay);
                        }
                        day.setDate(day.getDate() + 1);
                        resultDays = resultDays.filter((day) => {
                            return !~this.state.nonWorkDaysTime.indexOf(day.getTime());
                        });
                    }
                    this.setState({
                        selectedDays: resultDays
                    });
                }
            }
        }
    }

    nonWorkDays(day) {
        return ~this.state.nonWorkDaysTime.indexOf(day.getTime());
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.nonWorkDaysSelectionRegime) {
            this.setState({
                selectedDays: []
            });
        }
    }

    hydrateStateWithLocalStorage() {
        // for all items in state
        for (let key in this.state) {
            // if the key exists in localStorage
            if (localStorage.hasOwnProperty(key)) {
                // get the key's value from localStorage
                let value = localStorage.getItem(key);

                // parse the localStorage string and setState
                try {
                    value = JSON.parse(value);
                    this.setState({[key]: value});
                } catch (e) {
                    // handle empty string
                    this.setState({[key]: value});
                }
            }
        }
    }

    componentDidMount() {
        this.hydrateStateWithLocalStorage();
    }

    render() {
        return (
            <div>
                <style>{nonWorkDaysStyle}</style>
                <DayPicker
                    selectedDays={this.state.selectedDays}
                    onDayClick={this.handleDayClick}
                    modifiers={{nonWorkDays: this.nonWorkDays}}
                />
                <p>
                    {this.state.selectedDays.length
                        ? this.state.selectedDays.map((selectedDay) => {
                            return selectedDay.toLocaleDateString()
                        }).join(', ')
                        : 'Please select a day 👻'}
                </p>
                <p>
                    {this.state.nonWorkDays.length ?
                        this.state.nonWorkDays.map((selectedDay) => {
                            return selectedDay.toLocaleDateString ? selectedDay.toLocaleString() : new Date(selectedDay).toLocaleDateString();
                        }).join(', ') + ' - Non-workable days' :
                        ''
                    }
                </p>
            </div>
        );
    };
}

export default Calendar;