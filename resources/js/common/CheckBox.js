import React, { Component } from "react";
import classnames from "classnames";

class CheckBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value ? props.value : ""
        };
    }

    onChange(event) {
        const value = event.target.checked;
        this.setState({
            value: value
        }, () => {
            if(this.props.onChange) {
                this.props.onChange(event, value);
            }
        });
    }

    render() {
        const { value } = this.state;
        const { labelText, name, id } = this.props;

        return (
            <label className="checkbox">
                <input
                    className="form-check-input"
                    type="checkbox"
                    value={value ? value : ""}
                    checked={value ? value : ""}
                    name={name}
                    id={id ? id : name}
                    onChange={(event) => this.onChange(event)}
                />
                <span>{labelText}</span>
            </label>
        );
    }
}

export default CheckBox;