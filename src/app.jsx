import React, {Component} from 'react';
import './app.css';
import 'react-day-picker/lib/style.css'
import Calendar from "./app/components/Calendar";
import Sidebar from "./app/components/Sidebar"

class App extends Component {

    constructor(props) {
        super(props);
        this.handleGroupSelected = this.handleGroupSelected.bind(this);
        this.handleChangeSelectionRegime = this.handleChangeSelectionRegime.bind(this);
        this.state = {
            days: [],
            countOfTrainings: 8,
            nonWorkDaysSelectionRegime: false
        };
    }

    handleGroupSelected(days, countOfTrainings) {
        this.setState({
            days: days,
            countOfTrainings: countOfTrainings
        });
    }

    handleChangeSelectionRegime(isNonWorkDaysSelection) {
        this.setState({
           nonWorkDaysSelectionRegime: isNonWorkDaysSelection
        });
    }

    render() {
        return (
            <div style={styles.rootStyles} className="root">
                <div style={styles.componentsWrapper}>
                    <Sidebar nonWorkDaysSelectionRegime={this.handleChangeSelectionRegime} onGroupSelected={this.handleGroupSelected}/>
                    <Calendar daysToSelect={this.state.days} countOfTrainings={this.state.countOfTrainings} nonWorkDaysSelectionRegime={this.state.nonWorkDaysSelectionRegime}/>
                </div>
            </div>
        );
    }
}

const styles = {
    rootStyles: {
        margin: 'auto',
        position: 'relative'
    },
    componentsWrapper: {
        verticalAlign: 'middle',
        textAlign: 'center'
    }
};

export default App;
