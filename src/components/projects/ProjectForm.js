import React, {Component} from 'react';
import { reduxForm, Field } from 'redux-form'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField'
import PropTypes from 'prop-types';
import * as Waziup from 'waziup-js'


class ProjectForm extends Component {

  constructor(props){
    super(props);
    const defaultProject = new Waziup.Project("MyProject")
    defaultProject.name = "My project"
    defaultProject.devices = []
    defaultProject.gateways = []
    this.state = {
      devices: [],
      gateways: [],
      project: (this.props.project? this.props.project: defaultProject)
    };
  }

  componentWillReceiveProps(){
    if(this.props.isEdit)
    this.setState({project:this.props.project})
  }
  
  componentWillReceiveProps(nextProps) { 
    if(nextProps.project && nextProps.project !== this.state.project) {
      this.setState({project: nextProps.project})
    }
  }

  compare(a,b) {
    if (a.id < b.id)
      return -1;
    if (a.id > b.id)
      return 1;
    return 0;
  }

  componentWillMount() {
    let devices =  this.props.devices.sort(this.compare);
    let gateways =  this.props.gateways;
    this.setState({devices:devices, gateways:gateways})
    console.log(devices,gateways);
  }

  handleChange = (field, event) => {
    const value = event.target.value;
    var project = this.state.project
    switch (field) {
      case "devices"      : project.devices = value; break;
      case "gateways" : project.gateways = value; break;
      case "name"         : project.name = value; break;
    }
    this.setState({project: project})
  }

  render() {
    const {modalOpen, handleClose, onSubmit} = this.props;
    const actions = [ 
      <Button color="primary" key="cancel" onTouchTap={()=>{handleClose();}}>Cancel</Button>,
      <Button color="primary" key="submit" onTouchTap={()=>{this.props.onSubmit(this.state.project); handleClose();}}>Submit</Button>
    ];

    return (
        <Dialog actions={actions} modal="true" open={modalOpen}>
          <DialogTitle>{this.props.isEdit? "Update A Project": "Add A Project"}</DialogTitle>
          <DialogContent>

          <Grid container spacing={24}>
        <Grid item xs={12}>
        <TextField
          id="standard-name"
          name="name"
          label="Project name"
          value={this.state.project.name}
          onChange={(n) => this.handleChange("name", n)}
        />
        </Grid>
        <Grid item xs={6}>
          <FormControl style={{display: 'flex'}}>
            <InputLabel htmlFor="devices">Devices</InputLabel>
            <Select multiple={true}
              input={<Input name="devices" id="devices" />}
              value={this.state.project.devices} onChange={(s) => this.handleChange("devices", s)}>
              {this.state.devices.map(s => <MenuItem key={s.id} checked={this.state.project.devices.includes(s.id)} value={s.id}>{s.id}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl style={{display: 'flex'}}>
            <InputLabel htmlFor="gateways">Gateways</InputLabel>
            <Select multiple={true}
              input={<Input name="gateways" id="gateways" />}
              value={this.state.project.gateways} onChange={(s) => this.handleChange("gateways", s)}>
              {this.state.gateways.map(s => <MenuItem key={s.id} checked={this.state.project.gateways.includes(s.id)} value={s.id}>{s.name}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>

      </Grid>
          </DialogContent>
          <DialogActions>
            {actions}
          </DialogActions>
        </Dialog>
      );
  }

  static propTypes = {
    project: PropTypes.object, //Should be a Waziup.Project
    modalOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isEdit: PropTypes.bool
  }
}

export default reduxForm({form: 'simple'})(ProjectForm)
