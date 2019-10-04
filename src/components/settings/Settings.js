import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container } from 'react-grid-system';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import settingsImage from '../../images/settings.png';
import Switch from "@material-ui/core/Switch";
import * as types from '../../actions/actionTypes';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

  }

  componentWillMount() {
  }

  componentWillUnmount() {
  }
  
  componentWillReceiveProps(nextProps) { 
  }

  render() {
    return (
      <Container fluid>
        <AppBar position="static" style={{marginBottom: '30px',background: '#e9edf2'}}>
          <Toolbar>
          <img src={settingsImage} height="50"/>
            <Typography variant="h5" className="page-title">
              Settings       
            </Typography>
          </Toolbar>
        </AppBar>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                id="boolValue"
                name="boolValue"
                checked={this.props.settings.displayCreators}
                onChange={(v) => {console.log(v.target.checked); this.props.setSettings( {...this.props.settings, displayCreators : v.target.checked})}}
                value={this.props.settings.displayCreators}
                color="primary"
              />
            }
          label="Display creation forms for devices and gateways"
          />
        </FormGroup>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings
  };
}

const mapDispatchToProps = dispatch => {
  return {
    setSettings: (settings) => dispatch({ type: types.SET_SETTINGS, settings })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Settings));
