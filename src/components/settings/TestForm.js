import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";

class TestForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socialMessage: {
        channel: this.props.channel ? this.props.channel : "",
        message: "",
        username: this.props.user
      }
    };
  }

  componentWillReceiveProps(nextProps) { 
    const socialMessage = this.state.socialMessage;
    socialMessage.channel = nextProps.channel;
    this.setState({socialMessage})
  }

  handleChange = formData => {
    const socialMessage = this.state.socialMessage;
    socialMessage.message = formData.target.value;
    this.setState({ socialMessage });
  };

  render() {
    const { modalOpen, handleClose, onSubmit, channel } = this.props;
    const actions = [
      <Button
        color="primary"
        key="cancel"
        onTouchTap={() => {
          handleClose();
        }}
      >
        Cancel
      </Button>,
      <Button
        color="primary"
        key="submit"
        onTouchTap={() => {
          this.props.onSubmit(this.state.socialMessage);
          handleClose();
        }}
      >
        Submit
      </Button>
    ];

    return (
      <Dialog actions={actions} modal="true" open={modalOpen}>
        <DialogTitle>{"Test " + channel}</DialogTitle>
        <DialogContent>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <TextField
                name="message"
                label="Message"
                value={this.state.message}
                onChange={this.handleChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>{actions}</DialogActions>
      </Dialog>
    );
  }

  static propTypes = {
    channel: PropTypes.string.isRequired,
    modalOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
  };
}

export default reduxForm({ form: "simple" })(TestForm);
