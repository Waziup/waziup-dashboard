import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FullWidthSection from './FullWidthSection'
import { connect } from 'react-redux';
import SensorData from './SensorData.js'
import SensorForm from './sensors/sensorForm/sensorFormContainer.js'
import SensorOwner from './sensors/SensorOwner.js'
import RowActions from './sensors/RowActions.js'
import {createSensor, updateSensorStart ,adminLogin,updateSensorLocation} from '../actions/actions';
import { Container} from 'react-grid-system'
import Griddle from 'griddle-react';
import Spinner from 'react-spinkit';
import UTIL from '../utils';

class Sensors extends Component {
  constructor(props){
    super(props);
    this.state = {
      data : props.data,
      formData:{},
      update:false,
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
  componentDidMount(){
    this.props.adminLogin(this.props.user);
  }
  handleSensorDelete = (data)=>{console.log(data)}
  handleSensorUpdate = (data)=>{
      this.props.updateSensorStart(data);
      this.setState({update:true});
      this.setState({formData:data});
      this.setState({modalOpen: true});
  }



  handleOpen = () => {
    this.setState({update:false});
    this.setState({modalOpen: true});
  };

  handleClose = () => {
    this.setState({formData:{}});
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
  handleSubmitUpdate = (values) => {
      if (values.sensorLon) {
        let sensor  = {
          id: values.sensorId,
          update:{
              location: {
                  value: {
                    type: "Point",
                    coordinates: [values.sensorLon,values.sensorLat]
                  },
                  type: "geo:json"
            },
            owner: {
             type: "string",
             value: this.props.currentUser.username,
            },
          }
        }

        this.props.updateSensorLocation(sensor);
      }
  }

  handleSubmit = (values) => {
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
        owner: {
         type: "string",
         value: this.props.currentUser.username,
        },
    }
/*     sensor[values.sensorMeasurement] = { */
      // value: 0,
      // type: values.sensorValueType
    /* } */
    this.props.createSensor(sensor)
  }
  render() {
    let {data} = this.props;

    return (
          <div>
            <h1 className="page-title">Sensors</h1>
          { this.state.isLoading ? <Spinner spinnerName="three-bounce" /> : null }

          <Container fluid={true}>
            <RaisedButton label="Add Sensors" primary={true} onTouchTap={()=>{
                this.setState({formData:{}});
                this.handleOpen();
            }} />
              <FullWidthSection useContent={true}>
                <Griddle resultsPerPage={10} results={this.state.data} columnMetadata={this.tableMeta} columns={["id", "type","owner","last_value",'actions']} showFilter={true} />
              </FullWidthSection>
                <SensorForm   ref={'sForm'} modalOpen={this.state.modalOpen}
                 handleClose={this.handleClose} onSubmit={ this.state.update ? this.handleSubmitUpdate : this.handleSubmit} />
            </Container>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
      data: state.example.data,
      isLoading:state.example.isLoading,
      user: state.keycloak.idTokenParsed,
      currentUser:state.currentUser.currentUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createSensor:(sensor)=>{dispatch(createSensor(sensor))},
    updateSensorStart:(sensor)=>{dispatch(updateSensorStart(sensor))},
    updateSensorLocation:(sensor)=>{dispatch(updateSensorLocation(sensor))},
    adminLogin:(user)=>{dispatch(adminLogin(user))}
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Sensors);

