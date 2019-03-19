import React, { Component } from "react";
import classnames from "classnames";
import validator from "validator";

class TextField extends Component {
	constructor(props) {
		super(props);

		this.state = {
			focused: false,
            controlled: props.controlled,
            validation: props.validation ? props.validation : [],
            isValid: true,
            required: props.required ? props.required : false,
            type: props.type ? props.type : "text",
            errorText: "",
            value: props.value ? props.value : "",
            initialValue: props.value ? props.value : ""
        };
    }

    componentDidMount() {
        this.props.onChange(this.props.name, this.state.value, this.isValid());
    }

	componentDidUpdate(prevProps) {
        if (
            (this.props.type && this.props.type !== prevProps.type) ||
            (this.props.value && this.props.value !== prevProps.value) ||
            (this.props.validation && this.props.validation !== prevProps.validation)
        ) {
            this.setState({
                type: this.props.type ? this.props.type : "text",
                value: this.state.controlled ? this.props.value ? this.props.value : "" : this.state.value,
                initialValue: this.state.controlled ? this.props.value ? this.props.value : "" : this.state.value,
                validation: this.props.validation ? this.props.validation : []
            });
        }
    }

	onKeyDown(event) {
        if(this.props.onKeyDown){
            this.props.onKeyDown(event);
        }
    }

    onKeyUp(event) {
        if(this.props.onKeyUp){
            this.props.onKeyUp(event);
        }
    }

	onChange(value) {
        this.setState({
            value: value
        }, () => {
            if(this.props.onChange) {
                this.props.onChange(this.props.name, value, this.isValid());
            }
        });
    }

	onBlur(event, name) {
        this.setState({
            focused: false,
            value: this.state.value ? this.state.value.trim() : "",
            initialValue: this.state.value ? this.state.value.trim() : ""
        }, () => {
            const result = this.isValid(true);
            if(this.props.onBlur) {
                this.props.onBlur({key: name, value: result});
            }
        });
    }

	isValid(showError) {
        let value = this.state.value ? this.state.value : "";
        let result = true;
        let error = "";
        for (let i = 0, len = this.state.validation.length; i < len; i++) {
            let validation = this.state.validation[i];
            if(validation) {
                let type = validation.type.split(":");
                switch (type[0]) {
					case "isEmpty": {
						result = !validator.isEmpty(value);
						break;
					}
					case "isAlphanumeric": {
						result = value.length > 0 || this.state.required ? validator.isAlphanumeric(value.replace(/ /g, "")) : true;
						break;
					}
					case "isMobilePhone": {
						result = value.length > 0 || this.state.required ? validator.isMobilePhone(value,"any") : true;
						break;
					}
					case "isPostalCode": {
						result = value.length > 0 || this.state.required ? validator.isPostalCode(value,"any") : true;
						break;
					}
					case "isAlpha": {
						result = value.length > 0 || this.state.required ? validator.isAlpha(value.replace(/ /g, "")) : true;
						break;
					}
					case "isEmail": {
						result = value.length > 0 || this.state.required ? validator.isEmail(value) : true;
						break;
					}
					case "isNumeric": {
						result = value.length > 0 || this.state.required ? validator.isNumeric(value) : true;
						break;
					}
					case "isNumber": {
						result = value.length > 0 || this.state.required ? validator.isNumeric(value) || validator.isDecimal(value) : true;
						break;
					}
					case "minLength": {
						result = value.length > 0 || this.state.required ? validator.isLength(value,{min:type[1], max: undefined}) : true;
						break;
					}
					case "contains": {
						result = value.length > 0 || this.state.required ? !validator.contains(value.toLowerCase(),type[1].toLowerCase()) : true;
						break;
					}
					case "matches": {
						result = value.length > 0 || this.state.required ? validator.matches(value, type[1]) : true;
						break;
					}
					case "equals": {
						let str = type[1].split("|");
						for (let j = 0; j < str.length; j++) {
							result = value.length > 0 || this.state.required ? !validator.equals(value.toLowerCase(),str[j].toLowerCase()) : true;
							if(!result){
								break;
							}
						}
						break;
                    }
                    case "equalTo": {
                        result = value.length > 0 || this.state.required ? value == this.props.equalTo : true;
                        break;
                    }
                }

                if(!result) {
                    error = validation.error;
                    break;
                }
            }
        }

        this.setState({
            isValid: result,
            errorText: showError ? error : ""
        });

        return result;
    }

    getValue() {
        return this.state.value ? this.state.value.trim() : "";
    }

    setValue(value, callback) {
        this.setState({
            value: value,
        }, () => {
            this.isValid();
            this.onChange(value);
            if(callback){
                callback();
            }
        });
    }

    reset() {
        this.setState({
            validation: [],
            isValid: true,
            required: false,
            errorText: "",
            value: "",
            initialValue: ""
        }, () => {
            if(!this.props.mask) {
                this[this.props.name].value = "";
            }
        });
    }

	render() {
		const { isValid, value, type, errorText } = this.state;
		const { labelText, name, id, required, maxLength, disabled, readOnly, placeholder, icon } = this.props;

		return (
            <label className={classnames({ "invalid": !isValid })}>
                <span>{labelText}</span>
                <input
                    onChange={(event) => this.onChange(event.target.value)}
                    onBlur={(event) => this.onBlur(event, name)}
                    onKeyDown={(event) => this.onKeyDown(event)}
                    onKeyUp={(event) => this.onKeyUp(event)}
                    value={value ? value : ""}
                    name={name}
                    id={id ? id : name}
                    type={type}
                    required={required}
                    maxLength={maxLength}
                    disabled={disabled}
                    readOnly={readOnly}
                    placeholder={placeholder || "Enter " + labelText.toLowerCase()}
                    className={classnames("form-control", { "is-invalid": !isValid })}
                />
                {icon && <i className={icon}/>}
                {!isValid && <span className="invalid-feedback">{errorText}</span>}
            </label>
		);
	}
}

export default TextField;