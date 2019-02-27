import React, { Component } from "react";

class Select extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value ? props.value : "",
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

    setValue(value, callback) {
        this.setState({
            value: value,
        }, () => {
            this.onChange(value);
            if(callback){
                callback();
            }
        });
    }

    render() {
        const { value } = this.state;
        const { name, items, id, val } = this.props;

        return (
            <select
                name={name}
                value={value}
                onChange={(event) => this.onChange(event.target.value)}>
                {
                    items.map((item, i) => {
                        return (
                            <option key={i} value={item[id]}>
                                {item[val]}
                            </option>
                        )
                    })
                }
            </select>
        );
    }
}

export default Select;