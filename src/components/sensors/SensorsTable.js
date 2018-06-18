import React, { Component } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

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
        <TableHeader displaySelectAll={false}>
          <TableRow>
            <TableHeaderColumn>ID</TableHeaderColumn>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Owner</TableHeaderColumn>
            <TableHeaderColumn>Measurements</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
        {this.props.sensors.map( sensor => (
          <TableRow key={sensor.id}>
            <TableRowColumn>
              <Link to={"/sensors/" + sensor.id}>
                {sensor.id}
              </Link>
            </TableRowColumn>
            <TableRowColumn> {sensor.name} </TableRowColumn>
            <TableRowColumn>{sensor.owner} </TableRowColumn>
            <TableRowColumn>
              <Table>
                <TableBody displayRowCheckbox={false}>
                  {sensor.measurements.map( meas => (
                    <TableRow>
                      <TableRowColumn> 
                        <Link to={"/sensors/" + sensor.id + "/" + meas.id}>
                          {(meas.name? meas.name: meas.id) + ": " + (meas.last_value? meas.last_value.value: "") + " " + (meas.unit? meas.unit: "")} 
                        </Link>
                      </TableRowColumn> 
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableRowColumn>
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
