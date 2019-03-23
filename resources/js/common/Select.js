import React, { Component } from "react";

class Select extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.value ? props.value : "",
        };

        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        let { name } = this.props;
        if (name && this.props.onChange) {
            this.props.onChange(name.replace("[]", ""), this.state.value, !!this.state.value);
        }
    }

    onChange(event) {
        let value = event.target.value;
        if (this.props.multiple) {
            value = [];
            var options = event.target.selectedOptions;
            for (let i = 0; i < options.length; i++) {
                value.push(options[i].value);
            }
        }
        this.setState({
            value: value
        }, () => {
            if(this.props.onChange) {
                let { name } = this.props;
                if (name) {
                    this.props.onChange(name.replace("[]", ""), value, !!value);
                } else {
                    this.props.onChange(value, !!value);
                }
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
        let { value } = this.state;
        const { name, items, id, val, placeholder, multiple } = this.props;

        if (multiple && !Array.isArray(value)) value = [value];

        return (
            <select
                name={name}
                value={value}
                onChange={this.onChange}
                multiple={multiple}>
                {placeholder && <option value={""}>{placeholder}</option>}
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