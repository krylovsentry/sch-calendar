import React from "react";


class Group extends React.Component {
    DAYS = ["Sunday", "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"];

    constructor(props) {
        super(props);
        this.handleSelection = this.handleSelection.bind(this);
        this.handleClickDeleteGroupButton = this.handleClickDeleteGroupButton.bind(this);
        this.state = {
            selected: false
        };

    }

    handleSelection() {
        if (this.state.selected) {
            this.setState({
                selected: false
            })
        } else {
            this.setState({
                selected: true
            });
            this.props.onSelected(this.props.groupDays, this.props.countOfTrainings);
        }
    }

    getStyle() {
        return {
            borderColor: this.state.selected ? '#2980b9' : '#cfcece'
        }
    }

    handleClickDeleteGroupButton() {
        this.props.onDeleteGroup(this.props.groupName);
    }

    render() {
        return (
            <div className='group' hidden={!this.props.groupDays} onClick={this.handleSelection}
                 style={this.getStyle()}>
                {this.props.groupDays ? this.props.groupName + ' (' + this.props.countOfTrainings + ' days)' + ': ' + this.props.groupDays.map((day) => {
                    return this.DAYS[day]
                }).join(', ') : ""}
                <button className="button" onClick={this.handleClickDeleteGroupButton}>delete group</button>
            </div>
        );
    }
}

export default Group;