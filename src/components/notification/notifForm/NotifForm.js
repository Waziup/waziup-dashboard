import React, {Component} from 'react';
import { reduxForm, Field,FieldArray } from 'redux-form'
import Dialog from 'material-ui/Dialog';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import UTIL from '../../../utils.js';
import MenuItem from 'material-ui/MenuItem'
import { RadioButton } from 'material-ui/RadioButton'
import IconButton from 'material-ui/IconButton';
import {blue500, red500, greenA200} from 'material-ui/styles/colors';
import Delete from 'material-ui/svg-icons/action/delete';
import {
  SelectField,
  TextField,
} from 'redux-form-material-ui'
import {  Row, Col, Visible} from 'react-grid-system'
import { initialize } from 'redux-form'
// validation functions


class notifForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      notif:{}
    };
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps){
  }

  render() {
    const {pristine, reset, submitting,modalShowing, modalOpen,handleClose, onSubmit,formData} = this.props;
      const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={()=>{
            this.setState({notif:{}});
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
              title="Add new Notification"
              actions={actions}
              modal={true}
              open={modalOpen}
              autoScrollBodyContent={true}
              ref={'notifFormDialog'}
            >
          <form onSubmit={onSubmit}>
            <Row>
                <Field name="description"
                  component={TextField}
                  hintText="description"
                  floatingLabelText="Description"
                  ref="description" withRef/>
            </Row>
          </form>
        </Dialog>
      );
  }
}

// Decorate with redux-form
notifForm = reduxForm({
  form: 'notifForm',
  enableReinitialize : true, // this is needed!!
})(notifForm)

notifForm = connect(
  state => ({
    initialValues:{
    }
  })
)(notifForm)
export default notifForm;

