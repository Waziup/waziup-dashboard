import React, {Component} from 'react';
import { reduxForm, Field } from 'redux-form'
import Dialog from 'material-ui/Dialog';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem'
import { SelectField, TextField } from 'redux-form-material-ui'
import { Row, Col} from 'react-grid-system'

const position = [12.238, -1.561];

class EventForm extends Component {

  constructor(props){
    super(props);
    this.state = {
      position : [12.238000,-1.561111],
      record:{
      }
    };
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps){
  }
  render() {
    const {reset, modalOpen, handleClose, onSubmit} = this.props;
      const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={()=>{
            this.setState({sensor:{}});
            reset();
            handleClose();
        }}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onTouchTap={()=>{
          this.props.submit();
          handleClose();
        }}
      />,
    ];

    return (
        <Dialog
              title={`Record an Event for field : ${this.props.sensor.id}`}
              actions={actions}
              modal={true}
              open={modalOpen}
              autoScrollBodyContent={true}
              ref={'recordFormDialog'}
            >
          <form onSubmit={onSubmit}>
            <Row>
              <Col md={4}>
                <Field name="recordId"
                  component={TextField}
                  hintText="Record id"
                  floatingLabelText="Record Id"
                  ref="recordId" withRef/>
              </Col>
              <Col md={4} offset={{md:2}}>
                <Field
                  name="recordType"
                  component={SelectField}
                  hintText="Record Type"
                  floatingLabelText="Record Type">
                  <MenuItem value="water" primaryText="Water Input"/>
                  <MenuItem value="chemical" primaryText="Chemical"/>
                  <MenuItem value="germination" primaryText="Germination"/>
                  <MenuItem value="food" primaryText="Food"/>
                  <MenuItem value="harvest" primaryText="Harvesting"/>
                  <MenuItem value="other" primaryText="Other"/>

                </Field>
              </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <Field name="recordQuantity"
                    component={TextField}
                    hintText="'12'"
                    floatingLabelText="Quantity"
                    ref="recordQuantity" withRef/>
                </Col>
                <Col md={4} offset={{md:2}}>
                  <Field name="recordDescription"
                    component={TextField}
                    hintText="Description"
                    floatingLabelText="Description"
                    ref="recordDescription" withRef/>
                </Col>
            </Row>
            <Row>
              <Col>
            {/* <Field
                    name="sensorValueType"
                    component={SelectField}
                    hintText="Sensor Value type"
                    floatingLabelText="Sensor Value Type">
                    <MenuItem value="number" primaryText="Number"/>
                    <MenuItem value="percent" primaryText="Percent"/>
                  </Field>*/}
              </Col>
            </Row>
          </form>
        </Dialog>
      );
  }
}

// Decorate with redux-form
EventForm = reduxForm({
  form: 'eventForm',
  enableReinitialize : true, // this is needed!!
})(EventForm)

EventForm = connect(
  state => ({
    initialValues:{
        "recordId": state.sensor.sensor.id,
    }
  })
)(EventForm)
export default EventForm;
