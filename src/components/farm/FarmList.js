import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import FarmActions from './FarmActions.js'
import { Container } from 'react-grid-system'
import FarmForm from './FarmFormContainer.js'
import Griddle, { plugins, RowDefinition, ColumnDefinition } from 'griddle-react';
import Spinner from 'react-spinkit';
import Utils from '../../lib/utils';
import { loadSensors, createFarm, updateFarm, selectFarm, deleteSensor, updateSensorFarmAction } from "../../api-adapter.js"
import EventForm from '../event/eventsForm/EventFormContainer.js'

class FarmList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      farms: [],
      update: false,
      modalEventOpen: false,
      isLoading: false,
      modalFarmOpen: false,
    };
  }

  componentDidMount() {
    if (this.props.sensors.length === 0)
      this.props.loadSensors(true, this.props.user);
    this.findSetFarms(this.props)
  }

  findSetFarms(props) {
    const farms = props.sensors.filter(el => (el.type === 'Farm'));

    if (!!farms)
      this.setState({ farms: farms });
    else
      this.setState({ farms: [] });

    this.setState({ isLoading: props.isLoading })
  }

  handleSensorDelete = (data) => {
    deleteSensor(data);
    this.props.loadSensors(true, this.props.user);
  }

  handleEventClose = () => {
    this.setState({ formData: {} });
    this.setState({ modalEventOpen: false });
  }

  handleCreateFarmOpen = () => {
    this.setState({ update: false });
    this.setState({ modalFarmOpen: true });
  }

  handleEventOpen = (farmData) => {
    console.log(JSON.stringify(farmData));
    this.props.selectFarm(farmData);
    this.setState({ modalEventOpen: true });
  }

  handleUpdateFarmOpen = (farmData) => {
    this.props.selectFarm(farmData);
    this.setState({ update: true });
    this.setState({ modalFarmOpen: true });
  }

  handleEventSubmit = (values) => {
    console.log("handleEventSubmit", this.props.user.Service, this.props.farm.servicePath.value, this.props.farm.id
      , values.eventType, values.quantity, values.description, values.date);
    this.props.updateSensorFarmAction(this.props.user.Service, this.props.farm.servicePath.value, this.props.farm.id, values);
    //this.props.loadSensors(true, this.props.user);
  }

  handleFarmCreateSubmit = (values) => {
    console.log('handleFarmCreateSubmit:', values);
    this.props.createFarm(values, this.props.user);
    this.props.loadSensors(true, this.props.user);
  }

  handleFarmUpdateSubmit = (values) => {
    console.log('handleFarmUpdateSubmit:', values, this.props.farm.id, this.props.user.Service);
    this.props.updateFarm(values, this.props.farm.id, this.props.user.Service);
    this.props.loadSensors(true, this.props.user);
  }

  handleCloseFarm = () => {
    this.setState({ modalFarmOpen: false });
  }

  render() {
    const rowDataSelector = (state, { griddleKey }) => {
      return state
        .get('data')
        .find(rowMap => rowMap.get('griddleKey') === griddleKey)
        .delete('griddleKey')
        .toJSON();
    };

    const enhancedWithRowData = connect((state, props) => {
      return {
        // rowData will be available into RowActions
        rowData: rowDataSelector(state, props),
        deleteAction: this.handleSensorDelete,
        updateAction: this.handleUpdateFarmOpen,
        eventAction: this.handleEventOpen
      };
    });

    return (
      <div>
        <h1 className="page-title">Farms</h1>
        {this.state.isLoading && <Spinner spinnerName="three-bounce" />}

        {(this.props.sensors.length > 0) &&
          <Container fluid={true}>
          <EventForm ref={'eventForm'} modalOpen={this.state.modalEventOpen} handleClose={this.handleEventClose}
            onSubmit={this.handleEventSubmit} />
          <FarmForm ref={'vForm'} modalOpen={this.state.modalFarmOpen} handleClose={this.handleCloseFarm}
            onSubmit={this.state.update === true ? this.handleFarmUpdateSubmit : this.handleFarmCreateSubmit} />
            <br />
            {
              Utils.isAdmin(this.props.user.permissions) && <center>
                <RaisedButton label="Add New FARM" primary={true} onTouchTap={() => { this.handleCreateFarmOpen(); }} />
              </center>
            }
            <div>
              <Griddle resultsPerPage={50} data={this.state.farms} plugins={[plugins.LocalPlugin]} showFilter={true} styleConfig={Utils.styleConfig()} >
                <RowDefinition>
                  <ColumnDefinition id="name.value" title="Farm Name" />
                  <ColumnDefinition id="owner.value" title="Owner" />
                  <ColumnDefinition id="irrigationType.value" title="Irrigation Type" />
                  <ColumnDefinition id="overIrrigationZone.value" title="Over Irrigation" />
                  <ColumnDefinition id="overDryZone.value" title="Over Dry" />
                  <ColumnDefinition id="crop.value" title="Crops" />
                  <ColumnDefinition id="address.value" title="Address" />
                  <ColumnDefinition id="servicePath.value" title="ServicePath" />
                  <ColumnDefinition id="actions" title="Actions" customComponent={enhancedWithRowData(FarmActions)} />
                </RowDefinition>
              </Griddle>
            </div>
          </Container>
        }
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    farm: state.farm.farm,
    sensors: state.sensors.sensors,
    isLoading: state.sensors.isLoading,
    user: state.keycloak.idTokenParsed
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadSensors: (isAllSensors, user) => { dispatch(loadSensors(isAllSensors, user)) },
    createFarm: (a, b) => { dispatch(createFarm(a, b)) },
    selectFarm: (a) => { dispatch(selectFarm(a)) },
    updateFarm: (a, b, c) => { dispatch(updateFarm(a, b, c)) },
    //createRecord: (record, servicePath) => { dispatch(createRecord(record, servicePath)) },
    //updateSensorStart: (sensor, servicePath) => { dispatch(updateSensorStart(sensor, servicePath)) },
    updateSensorFarmAction: (service, servicePath, sensorId, recordType, recordQuantity, recordDescription) => {
      dispatch(updateSensorFarmAction(service, servicePath, sensorId, recordType, recordQuantity, recordDescription))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FarmList);