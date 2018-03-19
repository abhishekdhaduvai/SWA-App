import React from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import './dashboard.css';
import KeyValue from '../../web-components/KeyValue';

class Dashboard extends React.Component {
  render() {
    return (
      <div style={styles.container}>
        <div className="nav">
          <div 
            className="nav--item"
            onClick={e => this.props.history.push('/home')}>
            Home
          </div>
        </div>
        <div className="">
          <div className="flight--route">
            <h1>LAX - SFO</h1>
            <h2>Departing on <strong>03/20/2018</strong> and returning on <strong>04/01/2018</strong></h2>
          </div>
        </div>
        <div className="visuals">
          <div className="visuals--info">
            <KeyValue valueKey='Current Price' value='150' uom='USD' size='gamma' />
            <KeyValue valueKey='Lowest Price' value='150' uom='USD' size='gamma' />
            <KeyValue valueKey='Highest Price' value='350' uom='USD' size='gamma' />
          </div>
          <div className="visuals--charts">
            Charts here
          </div>
        </div>
      </div>
    )
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    background: '#f8b332',
    margin: '3em',
    boxShadow: '1px 1px 5px 0px rgba(0, 0, 0, 0.2)',
    borderRadius: '5px',
    overflow: 'scroll',
  },
}

export default withRouter(Dashboard);