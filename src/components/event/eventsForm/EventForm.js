import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import Dialog from 'material-ui/Dialog';
//import DatePicker from 'material-ui/DatePicker';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import { SelectField, TextField } from 'redux-form-material-ui';
import { Row, Col } from 'react-grid-system';
//import {renderDatePicker} from '../../../lib/Visualization.js'
import DateTime from 'react-datetime';

const renderDateTime = ({ input }) => (<DateTime {...input} />)

class EventForm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { reset, modalOpen, handleClose, onSubmit } = this.props;
    const actions = [
      <FlatButton
        label="Cancel"
        primary={false}
        onTouchTap={() => {
          reset();
          handleClose();
        }}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onTouchTap={() => {
          this.props.submit();
          handleClose();
        }}
      />,
    ];
    //${this.props.farm.name.value}
    return (
      <Dialog
        title={`Record an Event for Farm`}
        actions={actions}
        modal={true}
        open={modalOpen}
        autoScrollBodyContent={true}
        ref={'eventForm'}
      >
        <form onSubmit={onSubmit}>
          <Row>
            <Col md={4}>
              <Field
                name="eventType"
                ref="eventType"
                component={SelectField}
                hintText="Event Type"
                floatingLabelText="Event Type" withRef>
                <MenuItem value="Water Irrigation" primaryText="Water Irrigation" />
                <MenuItem value="Rain Fall" primaryText="Rain Fall" />
                <MenuItem value="Nitrogen applied" primaryText="Nitrogen applied (kg)" />
                <MenuItem value="Phosphorous applied" primaryText="Phosphorous applied (kg)" />
                <MenuItem value="Potash applied" primaryText="Potash applied (kg)" />
                <MenuItem value="Zinc applied" primaryText="Zinc applied (kg)" />
                <MenuItem value="Herbicides used" primaryText="Herbicides used (ml)" />
                <MenuItem value="Fungicides used" primaryText="Fungicides used (grams)" />
                <MenuItem value="Emmamactin used" primaryText="Emmamactin used (ml)" />
                <MenuItem value="Granular Pesticides used" primaryText="Granular Pesticides used (kg)" />
                <MenuItem value="Chemical" primaryText="Chemical" />
                <MenuItem value="Sowing" primaryText="Sowing" />
                <MenuItem value="Germination" primaryText="Germination" />
                <MenuItem value="Harvesting" primaryText="Harvesting" />
                <MenuItem value="Other" primaryText="Other" />
              </Field>
            </Col>
            <Col md={4} offset={{ md: 2 }}>
              <Field name="date"
                component={renderDateTime}
                hintText="date"
                floatingLabelText="Date"
                ref="date" withRef />
            </Col>
          </Row>
          <Row>
            <Col md={4} >
              <Field name="quantity" ref="quantity"
                component={TextField}
                hintText="'101 kg'"
                floatingLabelText="Quantity"
                ref="quantity" withRef />
            </Col>
            <Col md={4} offset={{ md: 2 }}>
              <Field name="description"
                component={TextField}
                hintText="Description"
                floatingLabelText="Description"
                ref="description" withRef />
            </Col>
          </Row>
        </form>
      </Dialog>
    );
  }
}

EventForm = reduxForm({
  form: 'eventForm',
  enableReinitialize: true,
})(EventForm)

EventForm = connect(
  state => ({
  }))(EventForm)

export default EventForm;