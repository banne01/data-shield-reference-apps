import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { addSponsor, resetSponsorStatusCode } from '../../../Redux';
import TextField from '@material-ui/core/TextField';
import './style.css';

class Sponsor extends Component {
    constructor() {
        super()
        this.state = {
            chooseAmount: "50",
            amount: "50",
            address: "",
            zipCode: "",
            city: "",
            state: "",
            creditCard: "",
            expirationDate: null,
            cvv: "",
            errorMessage: ""
        }
    }

    componentDidMount() {
        this.props.resetSponsorStatusCode();
    }

    creditCardValidation = (creditCardNumber) => {
        const creditCardNumberString = creditCardNumber.toString();
        let sum = 0;

        for (let i = 0; i < creditCardNumberString.length; i++) {
            let intVal = parseInt(creditCardNumberString.substr(i, 1), 10);

            if (i % 2 === 0) {
                intVal *= 2;
                if (intVal > 9) {
                    intVal = 1 + (intVal % 10);
                }
            }

            sum += intVal;
        }

        return (sum % 10) === 0;
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.amount === "0") {
            return this.setState({errorMessage: "Please enter a non-zero amount."});
        } else if (
                this.state.amount.toString() === "" ||
                this.state.address === "" ||
                this.state.zipCode.toString() === "" ||
                this.state.city === "" ||
                this.state.state === "" ||
                this.state.creditCard.toString() === "" ||
                this.state.expirationDate === null ||
                this.state.cvv.toString() === ""
            ) {
            return this.setState({errorMessage: "Please fill out all of the fields."});
        } else if (this.state.creditCard.toString().length !== 16) {
            return this.setState({errorMessage: "This site only accepts 16 digit credit cards."})
        } else if (!this.creditCardValidation(this.state.creditCard)) {
            return this.setState({errorMessage: "Credit card number is invalid."})
        } else if (this.state.cvv.toString().length > 4 || this.state.cvv.toString().length < 2) {
            return this.setState({errorMessage: "CVV number is invalid."})
        }

        this.props.addSponsor({
            "name": this.props.user.loggedInAs.name,
            "email": this.props.user.loggedInAs.email,
            "campaign": "Default campaign",
            "contribution": parseInt(this.state.amount, 10),
            "address": [
                {
                    "address1": this.state.address,
                    "city": this.state.city,
                    "state": this.state.state,
                    "country": "Default Country",
                    "zipcode": this.state.zipCode
                }
            ],
            "creditCard": {
                number: this.state.creditCard,
                expiry: this.state.expirationDate,
                cvv: this.state.cvv
            },
            "date": Date.now(),
            "type": "Monthly"
        });
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
            errorMessage: ""
        });
    }

    handleClick = (e) => {
        this.setState({
            chooseAmount: e.target.id,
            amount: e.target.id === "Other" ? 50 : parseInt(e.target.id, 10)
        });
    }

    render() {
        const text = "Become a guardian for every child by making your first monthly gift.";

        let errorMessage = this.state.errorMessage;
        if (this.props.sponsorsInfo.statusCode >= 200 && this.props.sponsorsInfo.statusCode < 300) {
            this.props.sponsorsInfo.statusCode = null;
            this.props.history.push("/sponsor/thankyou");
        } else if (this.props.sponsorsInfo.statusCode !== null) {
            errorMessage = "We were unable to process your submission. Try again later.";
        }

        let sponsorPagePaddingBottom = {paddingBottom: "45.75px"}
        if (errorMessage !== "") {
            window.scrollTo(0, document.body.scrollHeight);
            sponsorPagePaddingBottom = {paddingBottom: "5px"}
        }

        return (
            <div className="changingComponent donate" style={sponsorPagePaddingBottom}>
                <p>{text}</p>
                <div className="donationChoices">
                    <div onClick={this.handleClick} id="20" className="choice"
                        style={{backgroundColor: this.state.chooseAmount !== "20"
                            ? "rgb(211, 213, 236)" : "rgb(0, 22, 150)",
                            color: this.state.chooseAmount === "20" ? "white" : "black"}}>$20</div>
                    <div onClick={this.handleClick} id="50" className="choice"
                        style={{backgroundColor: this.state.chooseAmount !== "50"
                            ? "rgb(211, 213, 236)" : "rgb(0, 22, 150)",
                            color: this.state.chooseAmount === "50" ? "white" : "black"}}>$50</div>
                    <div onClick={this.handleClick} id="100" className="choice"
                        style={{backgroundColor: this.state.chooseAmount !== "100"
                            ? "rgb(211, 213, 236)" : "rgb(0, 22, 150)",
                            color: this.state.chooseAmount === "100" ? "white" : "black"}}>$100</div>
                    <div onClick={this.handleClick} id="Other" className="choice"
                        style={{backgroundColor: this.state.chooseAmount !== "Other"
                            ? "rgb(211, 213, 236)" : "rgb(0, 22, 150)",
                            color: this.state.chooseAmount === "Other" ? "white" : "black"}}>Other</div>
                </div>
                <form onSubmit={this.handleSubmit}>
                    {this.state.chooseAmount === "Other" &&
                        <TextField
                            name="amount"
                            label="Amount"
                            value={this.state.amount}
                            onChange={this.handleChange}
                            fullWidth={true}
                            className="input"
                            type="number"
                        />
                    }
                    <TextField
                        name="address"
                        label="Address"
                        value={this.state.address}
                        onChange={this.handleChange}
                        fullWidth={true}
                        className="input"

                    />
                    <TextField
                        name="zipCode"
                        label="Zip Code"
                        value={this.state.zipCode}
                        onChange={this.handleChange}
                        fullWidth={true}
                        className="input"
                        type="number"
                    />
                    <TextField
                        name="city"
                        label="City"
                        value={this.state.city}
                        onChange={this.handleChange}
                        fullWidth={true}
                        className="input"
                    />
                    <TextField
                        name="state"
                        label="State"
                        value={this.state.state}
                        onChange={this.handleChange}
                        fullWidth={true}
                        className="input"
                    />
                    <TextField
                        name="creditCard"
                        label="Credit Card Number"
                        value={this.state.creditCard}
                        onChange={this.handleChange}
                        fullWidth={true}
                        className="input"
                        type="number"
                    />
                    <TextField
                        name="expirationDate"
                        label="Expiration Date"
                        value={this.state.expirationDate}
                        onChange={this.handleChange}
                        fullWidth={true}
                        className="input"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        name="cvv"
                        label="CVV Number"
                        value={this.state.cvv}
                        onChange={this.handleChange}
                        fullWidth={true}
                        className="input"
                        type="number"
                    />
                    <button>Submit Repeating Donation</button>
                    <p className="errorMessage">{errorMessage}</p>
                </form>
            </div>
        );
    }
}

export default withRouter(connect(state => state, { addSponsor, resetSponsorStatusCode })(Sponsor));
