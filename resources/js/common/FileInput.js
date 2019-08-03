import React, { Component } from "react";
import classnames from "classnames";
import { asset } from "../helpers/app";

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
        event.persist();
        this.setState({files: [...event.target.files]});
        if (this.props.onChange) this.props.onChange(event);
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

    getFileType(filename) {
        if (filename == "") return filename;
        var images = ["jpg", "jpeg", "png", "gif", "svg", "webp"];
        let ext = /[^.]+$/.exec(filename)[0];
        if (images.indexOf(ext) > -1) ext = "image/"+ext;
        return ext;
    }

    getFileURL(file) {
        let url = '';
        if (file.name.search('/') < 0) {
            url = URL.createObjectURL(file);
        } else {
            url = file.name;
        }
        return url;
    }

	render() {
        const { isValid, errorText } = this.state;
        let { files } = this.state;
        const { labelText, name, id, value, multiple, required, preview } = this.props;

        if (!files.length) files.push({
            name: value,
            type: this.getFileType(value)
        });

		return (
            <label className={classnames('uploader', { "invalid": !isValid }, preview)}>
                <h3>{labelText}</h3>
                <span>Drag n Drop</span>
                <span className="sep">-OR-</span>
                <span className="button">Upload</span>
                <div className="filenames">
                    {files.map((file, i) => {
                        return file.name ? <figure key={i}>
                            {file.type.search('image') > -1
                                ? <a href={this.getFileURL(file)} target="_blank">
                                    <img src={this.getFileURL(file)}/>
                                    <span>Download File</span>
                                </a>
                                : file.name.search('/') > -1
                                    ? <a href={asset(file.name)} target="_blank">Download File</a>
                                    : <figcaption>{file.name}</figcaption>
                            }
                        </figure> : false
                    })}
                </div>
                <input
                    onChange={this.onChange}
                    name={name}
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