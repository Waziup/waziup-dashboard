import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import Autorenew from 'material-ui/svg-icons/action/autorenew';
import SwapCalls from 'material-ui/svg-icons/communication/swap-calls';
import { connect } from 'react-redux';
import EventForm from './eventsForm/EventFormContainer.js'
import { Container} from 'react-grid-system'
import Griddle, {plugins, RowDefinition, ColumnDefinition} from 'griddle-react';
import Utils from '../../utils';
import {loadSensors,updateSensorFarmAction} from "../../index.js"
import SensorActions from '../sensors/SensorActions.js'

class Events extends Component {

  constructor(props){
    super(props);
    this.state = {
      fields:    [],
      record:    [],
      formData:   {},
      update:     false,
      modalOpen:  false,
      isLoading:  false,
    };
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.isLoading) {
      this.setState({isLoading:nextProps.isLoading})
    }
    if (nextProps.sensors) {
        let fields = [];
        nextProps.sensors.forEach((item) => {
            if(item.type === 'Field'){
                fields.push(item);
            }
        });
        this.setState({fields:fields});
    }
  }

  componentDidMount(){
      loadSensors(true);
  }

  handleOpen = (data) => {
    this.props.updateSensorStart(data);
    this.setState({update:false});
    this.setState({modalOpen: true});
  }

  handleClose = () => {
    this.setState({formData:{}});
    this.setState({modalOpen: false});
  }

  handleSubmit = (values) => {
      console.log(values);
      updateSensorFarmAction(values.recordId, values.recordType, values.recordQuantity,values.recordDescription);
      loadSensors(this.state.isAllSensors);
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
        updateAction: this.handleSensorUpdate,
        updateVectorAction: this.handleVectorUpdate,
        vectorAction: this.handleVectorSave,
        RecordEventAction: this.handleOpen,
      };
    });

    return (
          <div>
            <h1 className="page-title">Events</h1>
            <Container fluid={true}>
            {/*<RaisedButton label="NEW" primary={true} onTouchTap={()=>{ this.setState({formData: {}}); this.handleOpen();}} />*/}
            <Griddle resultsPerPage={50} data={this.state.fields} plugins={[plugins.LocalPlugin]} showFilter={true} styleConfig={Utils.styleConfig()} >
                    <RowDefinition>
                       <ColumnDefinition id="id"          title="ID"/>
                       <ColumnDefinition id="owner.value" title="Owner"/>
                       <ColumnDefinition id="type" title="Type"/>
                       <ColumnDefinition id="actions"     title="Actions" customComponent={enhancedWithRowData(SensorActions)}/>
                    </RowDefinition>
                </Griddle>

            <EventForm ref={'eventForm'} modalOpen={this.state.modalOpen} handleClose={this.handleClose} onSubmit={ this.state.update ? this.handleSubmitUpdate : this.handleSubmit} />
          </Container>
      </div>
    );
  }
}

export default Events;
