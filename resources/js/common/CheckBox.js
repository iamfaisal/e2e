import React, { Component } from "react";
import classnames from "classnames";

class CheckBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value ? props.value : ""
        };
    }

    onChange(value) {
        this.setState({
            value: value
        }, () => {
            if(this.props.onChange){
                this.props.onChange(value);
            }
        });
    }

    render() {
        const { value } = this.state;
        const { labelText, name, id } = this.props;

        return (
            <div className="form-group">
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        value={value ? value : ""}
                        checked={value ? value : ""}
                        name={name}
                        id={id ? id : name}
                        onChange={(event) => this.onChange(event.target.value)}
                    />
                    <label className="form-check-label" htmlFor={id ? id : name}>{labelText}</label>
                </div>
            </div>
        );
    }
}

export default CheckBox;