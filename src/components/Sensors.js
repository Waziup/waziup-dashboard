import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FullWidthSection from './FullWidthSection'
import { connect } from 'react-redux';
import SensorData from './SensorData.js'
import SensorForm from './sensors/sensorForm/sensorFormContainer.js'
import SensorOwner from './sensors/SensorOwner.js'
import RowActions from './sensors/RowActions.js'
import {createSensor, Row, Col } from '../actions/actions';
import { Container} from 'react-grid-system'
import Griddle from 'griddle-react';
import Spinner from 'react-spinkit';


class Sensors extends Component {
  constructor(props){
    super(props);
    this.state = {
      data : props.data,
      formData:{},
      modalOpen:false,
      isLoading:false
    };
  }
  defaultProps = {
    data: []
  };
  componentWillReceiveProps(nextProps){
    if (nextProps.data) {
      this.setState({data:nextProps.data})
    }
    if (nextProps.isLoading) {
      this.setState({isLoading:nextProps.isLoading})
    }
  }
  handleSensorDelete = (data)=>{console.log(data)}
  handleSensorUpdate = (data)=>{
      this.setState({formData:data});
      this.setState({modalOpen: true});
  }



  handleOpen = () => {
    this.setState({modalOpen: true});
  };

  handleClose = () => {
    this.setState({modalOpen: false});
  };
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
      "displayName": "Last Value",
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
    handleSubmit = (values) => {
    // Do something with the form values
    let sensor  = {
      id: values.sensorId,
      type: values.sensorType,
      location: {
          value: {
            type: "Point",
            coordinates: [values.sensorLon,values.sensorLat]
          },
          type: "geo:json"
        },

    }
    sensor[values.sensorMeasurement] = {
      value: 0,
      type: values.sensorValueType
    }
    this.props.createSensor(sensor)

  }
  render() {
    let {data} = this.props;

    return (
      <div>

            <h1 className="page-title">Sensors</h1>
          { this.state.isLoading ? <Spinner spinnerName="three-bounce" /> : null }

          <Container fluid={true}>
            <RaisedButton label="Add Sensors" primary={true} onTouchTap={this.handleOpen} />
              <FullWidthSection useContent={true}>
                <Griddle resultsPerPage={10} results={this.state.data} columnMetadata={this.tableMeta} columns={["id", "type","owner","last_value",'actions']} showFilter={true} />
              </FullWidthSection>
            {this.state.modalOpen ?
            <SensorForm   modalOpen={this.state.modalOpen} handleClose={this.handleClose} onSubmit={this.handleSubmit} formData={this.state.formData}/>
            :null}
            </Container>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
      data: state.example.data,
      isLoading:state.example.isLoading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createSensor:(sensor)=>{dispatch(createSensor(sensor))}
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Sensors);

