import React, { Component } from "react";
import CheckBox from "../../common/CheckBox";
import { read, create } from "../../helpers/resource";

class CancelMyClass extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.match.params.class,
            loading: false,
            dataLoaded: false,
            fields: {
                reason: "",
                policy: "",
            },
            class: {},
            courses: [],
            formValidationData: {},
            workshop: 0
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const { id } = this.state;

        read('classes/' + id, {})
            .then(res => {
                this.setState({
                    loaded: true,
                    class: res.data.class,
                    workshop: parseInt(res.data.class.is_workshop),
                    dataLoaded: true
                });
            })
            .catch(console.log);
    }

    handleChange(name, value) {
        let { fields } = this.state;
        if (event && event.target.files) {
            fields[name] = event.target.files;
        } else {
            fields[name] = value;
        }

        this.setState({
            fields: fields
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({loading: true});

        create('classes/cancel', new FormData(e.target), true)
            .then(res => {
                res.status === 200
                    ? this.props.history.push("/my-classes")
                    : this.setState({
                        loading: false,
                        isFormValid: false
                    });
            })
            .catch(err => {
                let { formValidationData } = this.state;
                formValidationData.form = "Unable To Cancel Class";
                this.setState({
                    formValidationData: formValidationData,
                    loading: false,
                    isFormValid: false
                })
            });
    }

    render() {
        let { id, dataLoaded, fields, loading, isFormValid, formValidationData, workshop } = this.state;

        if (!dataLoaded) return false;
        if (fields.reason && fields.policy) isFormValid = true;

        let title = workshop ? "Workshop" : "Class";

        return (
            <div>
                <header className="pageheader">
                    <h2>Are you sure you want to cancel the {title.toLowerCase()}</h2>
                </header>

                <form className={loading ? "loading" : ""} onSubmit={this.handleSubmit}>
                    {formValidationData.form && !isFormValid && <div className="alert alert-danger">{formValidationData.form}</div>}

                    <fieldset className="fields">
                        <label>
                            <span>Please read our cancellation policy below</span>
                            <textarea readOnly value={"1. You must immediately notify all students who have RSVP’d. Clicking cancel below will also notify the E2E admin team of your cancellation.\n\n2. The instructor or sponsor representative must still show up and remain at the class location until 15 minutes past the original start time to notify anyone who may show up of the class cancellation. This is not an option, if you cancel a class this step is mandatory."} />
                        </label>
                        <label>
                            <span>Reason for cancellation</span>
                            <select name="reason" onChange={e => this.handleChange("reason", e.target.value)}>
                                <option value>Select a reason</option>
                                <option>No attendees</option>
                                <option>Sponsor / Affiliate Cancelled</option>
                                <option>Venue No Longer Available</option>
                                <option>Personal Issue</option>
                                <option>Other</option>
                            </select>
                        </label>

                        <CheckBox
                            onChange={(e, v) => this.handleChange("policy", v)}
                            name="policy"
                            labelText="I have read and agree to the cancellation policy"
                        />
                    </fieldset>

                    <button className="button" disabled={!isFormValid}>Cancel {title}</button>

                    <input type="hidden" name="class_id" value={id} />
                </form>
            </div>
        );
    }
}

export default CancelMyClass;