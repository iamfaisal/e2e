import React, { Component } from "react";
import classnames from "classnames";
import validator from "validator";

class FileInput extends Component {
	constructor(props) {
		super(props);

		this.state = {
			focused: false,
            controlled: props.controlled,
            validation: props.validation ? props.validation : [],
            isValid: true,
            required: props.required ? props.required : false,
            errorText: "",
            files: []
        };

        this.onChange = this.onChange.bind(this);
	}

	componentDidUpdate(prevProps) {
        if (this.props.validation && this.props.validation !== prevProps.validation) {
            this.setState({
                validation: this.props.validation ? this.props.validation : []
            });
        }
    }

	onChange(event) {
        this.setState({
            files: [...event.target.files]
        }, () => {
            if(this.props.onChange){
                this.props.onChange(event);
            }
        });
    }

	isValid() {
        let { files } = this.state;
        let valid = files.length ? true : false;
        let error = "";

        if(!valid) error = validation.error;

        this.setState({
            isValid: valid,
            errorText: error
        });

        return result;
    }

    getValue() {
        return this.state.files;
    }

    setValue(value, callback) {
        this.setState({
            files: value,
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
            files: []
        }, () => {
            if(!this.props.mask) {
                this[this.props.name].value = "";
            }
        });
    }

	render() {
        const { isValid, errorText } = this.state;
        let { files } = this.state;
        const { labelText, name, id, multiple, required } = this.props;

		return (
            <label for={id ? id : name} className={classnames('uploader', { "invalid": !isValid })}>
                <h3>{labelText}</h3>
                <span>Drag n Drop</span>
                <span className="sep">-OR-</span>
                <span className="button">Upload</span>
                <div className="filenames">
                    {files.map(file => {
                        return <span>{file.name}</span>
                    })}
                </div>
                <input
                    onChange={this.onChange}
                    name={name}
                    id={id ? id : name}
                    type="file"
                    multiple={multiple}
                    required={required}
                />
                {!isValid && <span className="invalid-feedback">{errorText}</span>}
            </label>
		);
	}
}

export default FileInput;