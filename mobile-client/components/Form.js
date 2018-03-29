import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  TextInput,
  TouchableOpacity
} from 'react-native';
import {
  Button,
  Input
} from 'react-native-elements';
import Calendar from 'react-native-calendar-select';

class Form extends React.Component {

  state = {
    originAirport: '',
    departDate: '',
    arriveDate: '',
  }

  confirmDate = ({startDate, endDate, startMoment, endMoment}) => {

    let departDate = `${startMoment.get('month')}/${startMoment.get('date')}/${startMoment.get('year')}`
    let arriveDate = `${endMoment.get('month')}/${endMoment.get('date')}/${endMoment.get('year')}`

    this.setState({
      departDate,
      arriveDate
    });
  }

  openCalendar = () => {
    this.calendar && this.calendar.open();
  }

  updateOriginAirport = (text) => {
    this.setState({ originAirport: text })
  }

  render() {
    let color = {
      mainColor: '#3B61AB'
    }
    let minDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

    return (
      <View>
        
        {/* Form View begins */}
        <View style={styles.formContainer}>

          {/* Origin Airport Input */}
          <View id='airports' style={styles.airportsContainer}>
            <View id='originAirport' style={{flex: 1}}>
              <Text>Origin</Text>
              <TextInput
                value={this.state.originAirport} 
                autoCapitalize='characters'
                style={styles.input}
                underlineColorAndroid='transparent'
                maxLength={3}
                onChange={e => this.updateOriginAirport(e.target.value)} />
            </View>

            {/* Destination Airport Input */}
            <View id='destinationAirport' style={{flex: 1}}>
              <Text>Destination</Text>
              <TextInput
                value={this.state.originAirport} 
                autoCapitalize='characters'
                style={styles.input}
                underlineColorAndroid='transparent'
                maxLength={3}
                onChange={e => this.updateOriginAirport(e.target.value)} />
            </View>
          </View>

          {/* Calendar */}
          <TouchableOpacity 
            style={styles.input}
            onPress={this.openCalendar}>          
              {this.state.arriveDate.toString().length > 0 &&
                <Text>
                  {this.state.departDate.toString()} - {this.state.arriveDate.toString()}
                </Text>
              }
              {this.state.arriveDate.toString().length === 0 &&
                <Text>
                  Touch Here to add your flight dates
                </Text>
              }
          </TouchableOpacity>

          <Calendar
            i18n="en"
            ref={(calendar) => {this.calendar = calendar;}}
            color={color}
            format="MM/DD/YYYY"
            startDate={minDate}
            onConfirm={this.confirmDate}
          />

        </View>
        {/* Form View ends here */}

        <Button 
          title='Create Alert'
          buttonStyle={styles.button} >
        </Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: '#fafafa',
    padding: 10,
    margin: 10,
    borderRadius: 3,
    elevation: 4
  },
  input: {
    color: '#3B61AB',
    fontSize: 25,
    fontWeight: 'bold',
    padding: 10,
    margin: 5,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D6D6DC',
  },
  button: {
    backgroundColor: '#3B61AB',
    padding: 10,
    margin: 10,
    borderRadius: 5
  },
  airportsContainer: {
    flexDirection: 'row'
  }
})

export default Form;