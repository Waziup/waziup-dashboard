import React, { Component } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import PropTypes from 'prop-types';


export default class SensorsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {

    let sensor = this.props.sensor;
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn>ID</TableHeaderColumn>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Owner</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
        {this.props.sensors.map( sensor => (
          <TableRow key={sensor.id}>
            <TableRowColumn>{sensor.id}</TableRowColumn>
            <TableRowColumn>{sensor.name}</TableRowColumn>
            <TableRowColumn>{sensor.owner}</TableRowColumn>
          </TableRow>
          ))}
        </TableBody>
     </Table>
    );
  }

  propTypes = {
    sensors: PropTypes.object.isRequired, //Should be a list of Waziup.Sensor
  }
}
