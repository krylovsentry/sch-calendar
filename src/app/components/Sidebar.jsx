import React from "react";
import Popup from "reactjs-popup";
import Checkbox from "react-simple-checkbox";
import Group from "./Group";


class Sidebar extends React.Component {

    dayNumbers = [];
    groupName = '';
    countOfTrainings = 8;

    constructor(props) {
        super(props);
        this.handleCreateButtonClick = this.handleCreateButtonClick.bind(this);
        this.createHandlerCheckBoxChange = this.createHandlerCheckBoxChange.bind(this);
        this.handleDeleteGroup = this.handleDeleteGroup.bind(this);
        this.handleNonWorkDaysSelection = this.handleNonWorkDaysSelection.bind(this);
        this.state = {
            groups: [],
            nonWorkDaysSelectable: false
        };
    }

    handleCreateButtonClick() {
        this.setState({
            groups: this.state.groups.concat([{
                name: this.groupName,
                days: Array.from(this.dayNumbers),
                countOfTrainings: this.countOfTrainings
            }])
        }, () => {
            localStorage.setItem('groups', JSON.stringify(this.state.groups));
        });
        this.dayNumbers = [];
    }

    handleDeleteGroup(groupName) {
        this.setState({
                groups: this.state.groups.filter((group) => {
                    return group.name !== groupName;
                })
            },
            () => {
                localStorage.setItem('groups', JSON.stringify(this.state.groups));
            });
    }

    handleNonWorkDaysSelection() {
        this.setState({
            nonWorkDaysSelectable: !this.state.nonWorkDaysSelectable
        }, () => {
            this.props.nonWorkDaysSelectionRegime(this.state.nonWorkDaysSelectable);
        });
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

    createHandlerCheckBoxChange(dayNumber) {
        return (isChecked) => {
            if (!isChecked) {
                this.dayNumbers = this.dayNumbers.filter((day) => {
                    return day !== dayNumber;
                });
            } else {
                this.dayNumbers.push(dayNumber);
            }
        }
    }

    getStyle() {
        return {
            borderColor: this.state.nonWorkDaysSelectable ? 'red' : '#cfcece'
        }
    }

    render() {
        return (
            <div>
                <Popup trigger={<button disabled={this.state.nonWorkDaysSelectable} className="button">Create
                    Group</button>} modal={true}>
                    {close => (
                        <div style={styles.popupContent}>
                            <span>Group name</span><input onChange={(event) => {
                            this.groupName = event.target.value;
                        }}/>
                            <span>Count of trainings</span><input type="number" pattern="[0-9]*" onChange={(event) => {
                            this.countOfTrainings = event.target.value;
                        }}/>
                            <div><Checkbox size={3} onChange={this.createHandlerCheckBoxChange(1)}/> Monday</div>
                            <div><Checkbox size={3} onChange={this.createHandlerCheckBoxChange(2)}/> Tuesday</div>
                            <div><Checkbox size={3} onChange={this.createHandlerCheckBoxChange(3)}/> Wednesday</div>
                            <div><Checkbox size={3} onChange={this.createHandlerCheckBoxChange(4)}/> Thursday</div>
                            <div><Checkbox size={3} onChange={this.createHandlerCheckBoxChange(5)}/> Friday</div>
                            <div><Checkbox size={3} onChange={this.createHandlerCheckBoxChange(6)}/> Saturday</div>
                            <div><Checkbox size={3} onChange={this.createHandlerCheckBoxChange(0)}/> Sunday</div>
                            <div className="buttons">
                                <button className="button" onClick={() => {
                                    this.handleCreateButtonClick();
                                    close();
                                }}>
                                    create
                                </button>
                                <button className="button" onClick={() => {
                                    close();
                                }}>
                                    close
                                </button>
                            </div>
                        </div>
                    )}
                </Popup>
                <button className="button" style={this.getStyle()} onClick={this.handleNonWorkDaysSelection}>Select
                    non-work days
                </button>
                <div>
                    {(!this.state.nonWorkDaysSelectable) ? this.state.groups.map((group) => <Group
                        groupName={group.name} groupDays={group.days} countOfTrainings={group.countOfTrainings}
                        onDeleteGroup={this.handleDeleteGroup}
                        onSelected={this.props.onGroupSelected}/>) : <div></div>}
                </div>
            </div>
        );
    }
}

const styles = {
    popupContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    }
};

export default Sidebar;