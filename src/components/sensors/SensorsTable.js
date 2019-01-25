import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
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
        <TableHead displaySelectAll={false}>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell>Measurements</TableCell>
          </TableRow>
        </TableHead>
        <TableBody displayRowCheckbox={false}>
        {this.props.sensors.map( sensor => (
          <TableRow key={sensor.id}>
            <TableCell>
              <Link to={"/sensors/" + sensor.id}>
                {sensor.id}
              </Link>
            </TableCell>
            <TableCell> {sensor.name} </TableCell>
            <TableCell>{sensor.owner} </TableCell>
            <TableCell>
              <Table>
                <TableBody displayRowCheckbox={false}>
                  {sensor.measurements.map( meas => (
                    <TableRow>
                      <TableCell> 
                        <Link to={"/sensors/" + sensor.id + "/" + meas.id}>
                          {(meas.name? meas.name: meas.id) + ": " + (meas.last_value? JSON.stringify(meas.last_value.value).replace(/"/g, ""): "") + " " + (meas.unit? meas.unit: "")} 
                        </Link>
                      </TableCell> 
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableCell>
          </TableRow>
          ))}
        </TableBody>
     </Table>
    );
  }

  static propTypes = {
    sensors: PropTypes.object.isRequired, //Should be a list of Waziup.Sensor
  }
}
