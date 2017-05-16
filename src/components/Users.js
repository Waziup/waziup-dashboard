import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FullWidthSection from './FullWidthSection'
import { connect } from 'react-redux';
import SensorData from './SensorData.js'
import SensorForm from './sensors/sensorForm/sensorFormContainer.js'
import SensorOwner from './sensors/SensorOwner.js'
import RowActions from './sensors/RowActions.js'
import {createSensor, updateSensorStart, adminLogin, updateSensorLocation} from '../actions/actions';
import { Container} from 'react-grid-system'
import Griddle from 'griddle-react';
import Spinner from 'react-spinkit';
import UTIL from '../utils';

class Users extends Component {
  constructor(props){
    super(props);
    this.state = {
      users : props.users,
      isLoading:false
    };
  }
  defaultProps = {
    users: []
  };
  componentWillReceiveProps(nextProps){
    if (nextProps.users) {
      this.setState({users:nextProps.users})
    }
  }
  componentDidMount(){
  }

  tableMeta = [
    {
      "columnName": "id",
      "order": 1,
      "displayName": "ID"
    },
    {
      "columnName": "type",
      "order": 2,
      "visible": true,
      "displayName": "Sensor type"
    },
    {
      "columnName": "owner",
      "order": 3,
      "visible": true,
      "displayName": "Owner",
      "customComponent": SensorOwner
    },
    {
      "columnName": "last_value",
      "order": 4,
      "visible": true,
      "displayName": "Last Values",
      "customComponent": SensorData
    },
    {
      "columnName": "actions",
      "order": 5,
      "visible": true,
      "displayName": "Actions",
      "customComponent": RowActions,
	  'customComponentMetadata': {
		'deleteAction': this.handleSensorDelete,
		'updateAction': this.handleSensorUpdate
		}
    },

  ];

  render() {
    let {user} = this.props;
    return (
          <div>
            <h1 className="page-title">Users</h1>
            { this.state.isLoading ? <Spinner spinnerName="three-bounce" /> : null }
            <Container fluid={true}>
              <FullWidthSection useContent={true}>
                <Griddle resultsPerPage={10} results={this.state.data} columnMetadata={this.tableMeta} columns={["id", "type","owner","last_value",'actions']} showFilter={true} />
              </FullWidthSection>
            </Container>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
      users: state.users.users,
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Users);

