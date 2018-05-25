import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import momentPropTypes from 'react-moment-proptypes';
import moment from 'moment';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import './home.css';

import axios from 'axios';
import Description from '../Description/Description';

import debounce from 'lodash/debounce';

class Home extends React.Component {

  state = {
    arriveAirport: 'OAK',
    departAirport: 'LAX',
    startDate: null,
    endDate: null,
    focusedInput: null,
    phone: '',
    threshold: '500',
    passengers: '2',
    email: '',
    error: false,
    success: false,
    overwriteDialog: false,
    overwrite: false
  };

  onDatesChange = ({ startDate, endDate }) => {
    this.setState({ startDate, endDate });
  }

  onFocusChange = (focusedInput) => {
    this.setState({ focusedInput });
  }

  submitForm = (e) => {
    const { 
      arriveAirport, 
      departAirport, 
      phone,
      focusedInput, 
      startDate, 
      endDate,
      passengers,
      threshold,
      email } = this.state;

    if(
      startDate === null || 
      endDate === null ||
      departAirport === '' ||
      arriveAirport === '' ||
      phone.length !== 10 ||
      isNaN(phone) ||
      threshold === '' ||
      isNaN(threshold) ||
      passengers === '' ||
      isNaN(passengers)) {
        this.setState({error: true})
    } else {
      let item = {
        Item: {
          'departDate': {
            S: startDate.format('MM/DD/YYYY')
          },
          'returnDate': {
            S: endDate.format('MM/DD/YYYY')
          },
          'originAirport': {
            S: departAirport
          },
          'destinationAirport': {
            S: arriveAirport
          },
          'email': {
            S: email
          },
          'passengers': {
            N: passengers
          },
          'threshold': {
            N: threshold
          },
          'phone': {
            S: phone
          }
        },
      }
      axios.post('/submit', {data: item, overwrite: this.state.overwrite})
      .then(res => {this.setState({success: true})})
      .catch(err => {this.setState({overwriteDialog: true})})
    }
  }

  overwrite = () => {
    this.setState({ overwrite: true });
    this.submitForm();
  }

  updateEmail = debounce((email) => {
    this.setState({ email })
  }, 1000);

  render(){
    const { 
      arriveAirport, 
      departAirport, 
      phone,
      focusedInput, 
      startDate, 
      endDate,
      passengers,
      threshold,
      email } = this.state;
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={e => this.setState({error: false})}
      />,
    ];
    const overwriteActions = [
      <FlatButton
        label="Yes"
        primary={true}
        onClick={e => this.overwrite}
      />,
      <FlatButton
        label="No"
        primary={true}
        onClick={e => this.setState({overwriteDialog: false})}
      />,
    ];

    return (
      <div style={styles.container}>

        <div className="form">
        
          <div className='airport flex'>
            <div className='airport--field'>
              <div className='fieldName unselectable'>Depart</div>
              <input 
                type='text'
                maxLength="3"
                className="field"
                value={departAirport}
                onChange={e => this.setState({departAirport: e.target.value})} />
            </div>

            <div className='airport--field'>
              <div className='fieldName unselectable'>Arrive</div>
              <input 
                type='text' 
                maxLength="3"
                className="field"
                value={arriveAirport}
                onChange={e => this.setState({arriveAirport: e.target.value})} />
            </div>
          </div>

          <div style={styles.DateRangePicker}>
            <DateRangePicker
              onDatesChange={this.onDatesChange}
              onFocusChange={this.onFocusChange}
              focusedInput={focusedInput}
              startDate={startDate}
              endDate={endDate}
              startDatePlaceholderText={"Depart Date"}
              endDatePlaceholderText={"Return Date"}
              startDateId={"start_date"}
              endDateId={"end_date"}/>
          </div>

          <div className="phone">
            <div className="fieldName unselectable">Phone Number</div>
            <input 
              type="tel" 
              className="field"
              maxLength="10"
              value={phone}
              onChange={e => this.setState({phone: e.target.value})} />
          </div>

          <div className="email">
            <div className="fieldName unselectable">Email</div>
            <input 
              type="email" 
              className="field"
              value={email}
              // onChange={e => this.setState({email: e.target.value})} />
              onChange={e => this.updateEmail(e.target.value)} />
          </div>

          <div className='other flex'>
            <div className='other--field'>
              <div className='fieldName unselectable'>Passengers</div>
              <input 
                type='text'
                maxLength="3"
                className="field"
                value={passengers}
                onChange={e => this.setState({passengers: e.target.value})} />
            </div>

            <div className='other--field'>
              <div className='fieldName unselectable'>Max Price</div>
              <input 
                type='text' 
                className="field"
                value={threshold}
                onChange={e => this.setState({threshold: e.target.value})} />
            </div>
          </div>

          <RaisedButton 
            className="submitButton"
            label="Start Tracking" 
            primary={true} 
            style={styles.button}
            onClick={this.submitForm} />

        </div>

        <Description /> 

        <Dialog
          title="Missing Information"
          actions={actions}
          modal={false}
          open={this.state.error}
          onRequestClose={e => this.setState({error: false})}>
          Please fill all the fields with valid values in the Form.
        </Dialog>

        <Dialog
          title="Already Tracking"
          actions={overwriteActions}
          modal={false}
          open={this.state.overwriteDialog}>
          Looks like you're already tracking a flight. Track this one instead?
        </Dialog>

      </div> 
    )
  }
}

const styles = {
  container: {
    display: 'flex',
    flex: 1,
    background: '#f8b332',
    padding: '1em',
    margin: '3em',
    boxShadow: '1px 1px 5px 0px rgba(0, 0, 0, 0.2)',
    borderRadius: '5px',
    overflow: 'scroll',
  },
  DateRangePicker: {
    marginTop: '1em',
  },
  button: {
    margin: '1em 0em',
    width: '10em',
  },
  vr: {
    borderRight: '1px solid #424242',
    height: '3.5em',
    alignSelf: 'flex-end',
    margin: '0 0.2em 0.5em 0.2em',
  }
}

export default Home;