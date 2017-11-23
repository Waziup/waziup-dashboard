import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import { Link } from 'react-router';
import Delete from 'material-ui/svg-icons/action/delete';
import Update from 'material-ui/svg-icons/content/create';
//import View from 'material-ui/svg-icons/image/remove-red-eye';
import { blue500, red500 } from 'material-ui/styles/colors';
/*
        <IconButton tooltip="View" tooltipPosition="top-center" containerElement={<Link to={"/users/" + rowData.id} />} >
          <View color={blue500} />
        </IconButton>
                <IconButton tooltip="Delete" tooltipPosition="top-center" onTouchTap={() => { deleteAction(rowData.id) }}>
          <Delete color={red500} />
        </IconButton>
*/
class UserActions extends Component {
  render() {
    let { rowData, deleteAction, updateAction } = this.props;
    return (
      <div>
        <IconButton tooltip="Manage" tooltipPosition="top-center" containerElement={<Link to={"/users/".concat(rowData.id)} />}>
          <Update />
        </IconButton>
      </div>
    );
  }
}

export default UserActions;