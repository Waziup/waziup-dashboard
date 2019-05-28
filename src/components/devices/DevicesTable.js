import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

export default class DevicesTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {

    let device = this.props.device;
    return (
      <Table>
        <TableHead displaySelectAll={false}>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell>Sensors</TableCell>
          </TableRow>
        </TableHead>
        <TableBody displayRowCheckbox={false}>
        {this.props.devices.map( device => (
          <TableRow key={device.id}>
            <TableCell>
              <Link to={"/devices/" + device.id}>
                {device.id}
              </Link>
            </TableCell>
            <TableCell> {device.name} </TableCell>
            <TableCell>{device.owner} </TableCell>
            <TableCell>
              <Table>
                <TableBody displayRowCheckbox={false}>
                  {device.sensors.map( sens => (
                    <TableRow>
                      <TableCell> 
                        <Link to={"/devices/" + device.id + "/sensors/" + sens.id}>
                          {(sens.name? sens.name: sens.id) + ": " + (sens.value? JSON.stringify(sens.value.value).replace(/"/g, ""): "") + " " + (sens.unit? sens.unit: "")} 
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
    devices: PropTypes.object.isRequired, //Should be a list of Waziup.Device
  }
}
