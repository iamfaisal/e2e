import React, {Component, Fragment} from "react";
import {validations} from "../utils/validations";
import TextField from "../common/TextField";
import TextArea from "../common/TextArea";
import { getAuthUser } from "../helpers/auth";
import { is } from "../helpers/acl";

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            fields: {
                "first_name": "",
                "last_name": ""
            },
            formValidationData: {},
            isFormValid: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFields = this.handleFields.bind(this);
    }

    handleFields(field) {
        let { formValidationData, fields } = this.state;
        formValidationData[field.key] = field.value;
        this.setState({formValidationData: formValidationData});
        let isFormValid = true;
        for (let key in fields) {
            if (!formValidationData[key]) {
                isFormValid = false;
            }
        }
        this.setState({isFormValid: isFormValid});
    }

    handleChange(value) {
        let { fields } = this.state;
        fields[event.target.name] = event.target.value;
        this.setState({fields: fields});
    }

    handleSubmit(event) {
        event.preventDefault();

        const { isFormValid, fields } = this.state;
        this.setState({isLoading: true});

        const userData = {
            first_name: fields.first_name,
            last_name: fields.last_name
        };

        if (isFormValid) {
            console.log(userData);
        }
    }

    render() {
        const { fields, isFormValid, formValidationData } = this.state;
        const  user = getAuthUser();
        return (
            <div>
                <header>
                    <h2>Profile</h2>
                </header>

                <form onSubmit={this.handleSubmit}>
                    <legend>Basic information</legend>
                    <fieldset className="fields horizontal">
                        <TextField
                            onBlur={(isValid) => this.handleFields(isValid)}
                            onChange={(event) => this.handleChange(event)}
                            name="first_name"
                            value={user.profile.first_name}
                            required={true}
                            maxLength={50}
                            labelText="First Name"
                            validation={[validations.isEmpty]}
                            icon="ion-ios-person"/>
                        <TextField
                            onBlur={(isValid) => this.handleFields(isValid)}
                            onChange={(event) => this.handleChange(event)}
                            name="last_name"
                            value={user.profile.last_name}
                            required={true}
                            maxLength={50}
                            labelText="Last Name"
                            validation={[validations.isEmpty]}
                            icon="ion-ios-person"/>
                    </fieldset>
                    {is('instructor') &&
                    <Fragment>
                        <legend>Instructor's profile</legend>
                        <fieldset className="fields horizontal">
                            <TextField
                                onBlur={(isValid) => this.handleFields(isValid)}
                                onChange={(event) => this.handleChange(event)}
                                name="sub_domain"
                                value={user.profile.sub_domain}
                                required={true}
                                maxLength={50}
                                labelText="Subdomain (ex. sallysmith.psre.com)"
                                validation={[validations.isEmpty]}/>
                            <TextField
                                onBlur={(isValid) => this.handleFields(isValid)}
                                onChange={(event) => this.handleChange(event)}
                                name="email"
                                value={user.email}
                                required={true}
                                maxLength={50}
                                labelText="Email"
                                validation={[validations.isEmail]}/>
                            <TextField
                                onBlur={(isValid) => this.handleFields(isValid)}
                                onChange={(event) => this.handleChange(event)}
                                name="address"
                                value={user.profile.address}
                                required={true}
                                maxLength={50}
                                labelText="Street Address"
                                validation={[validations.isEmpty]}/>
                            <TextField
                                onBlur={(isValid) => this.handleFields(isValid)}
                                onChange={(event) => this.handleChange(event)}
                                name="city"
                                value={user.profile.city}
                                required={true}
                                maxLength={50}
                                labelText="City"
                                validation={[validations.isEmpty]}/>
                            <TextField
                                onBlur={(isValid) => this.handleFields(isValid)}
                                onChange={(event) => this.handleChange(event)}
                                name="state"
                                value={user.profile.state}
                                required={true}
                                maxLength={50}
                                labelText="State"
                                validation={[validations.isEmpty]}/>
                            <TextField
                                onBlur={(isValid) => this.handleFields(isValid)}
                                onChange={(event) => this.handleChange(event)}
                                name="zip_code"
                                value={user.profile.zip_code}
                                required={true}
                                maxLength={50}
                                labelText="Zip Code"
                                validation={[validations.isPostalCode]}/>
                            <TextField
                                onBlur={(isValid) => this.handleFields(isValid)}
                                onChange={(event) => this.handleChange(event)}
                                name="cell_phone"
                                value={user.profile.cell_phone}
                                required={true}
                                maxLength={50}
                                labelText="Cell Phone"
                                validation={[validations.isMobilePhone]}/>
                            <TextField
                                onBlur={(isValid) => this.handleFields(isValid)}
                                onChange={(event) => this.handleChange(event)}
                                name="work_phone"
                                value={user.profile.work_phone}
                                required={true}
                                maxLength={50}
                                labelText="Work Phone"
                                validation={[validations.isMobilePhone]}/>
                        </fieldset>
                        <fieldset className="fields horizontal">
                            <TextField
                                onBlur={(isValid) => this.handleFields(isValid)}
                                onChange={(event) => this.handleChange(event)}
                                name="additional_name"
                                value={user.profile.additional_name}
                                required={true}
                                maxLength={50}
                                labelText="Additional Name (#1)"
                                validation={[validations.isEmpty]}/>
                            <TextField
                                onBlur={(isValid) => this.handleFields(isValid)}
                                onChange={(event) => this.handleChange(event)}
                                name="additional_email"
                                value={user.profile.additional_email}
                                required={true}
                                maxLength={50}
                                labelText="Additional Email (#1)"
                                validation={[validations.isEmail]}/>
                            <TextField
                                onBlur={(isValid) => this.handleFields(isValid)}
                                onChange={(event) => this.handleChange(event)}
                                name="additional_name2"
                                value={user.profile.additional_name2}
                                required={true}
                                maxLength={50}
                                labelText="Additional Name (#2)"
                                validation={[validations.isEmpty]}/>
                            <TextField
                                onBlur={(isValid) => this.handleFields(isValid)}
                                onChange={(event) => this.handleChange(event)}
                                name="additional_email2"
                                value={user.profile.additional_email2}
                                required={true}
                                maxLength={50}
                                labelText="Additional Email (#2)"
                                validation={[validations.isEmail]}/>
                        </fieldset>
                        <fieldset className="fields horizontal">
                            <TextArea
                                onBlur={(isValid) => this.handleFields(isValid)}
                                onChange={(event) => this.handleChange(event)}
                                name="info"
                                value={user.profile.info}
                                required={true}
                                placeholder="Public Profile"
                                validation={[validations.isEmail]}/>
                        </fieldset>
                    </Fragment>
                    }
                    <button className="button" type="submit" disabled={!isFormValid}>
                        Update Profile
                    </button>
                </form>
            </div>
        );
    }
}

export default Profile;