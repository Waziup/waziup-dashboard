
import React, { Component } from 'react';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router';
import Delete from '@material-ui/icons/Delete';
import View from '@material-ui/icons/RemoveRedEye';
import { blue500, red500 } from '@material-ui/core/colors';

class NotifActions extends Component {
  render() {
    const { rowData, deleteAction, updateAction } = this.props;
    return (
      <div>
        <IconButton
          containerElement={<Link to={`/notifications/${rowData.id}`} />}
          tooltip="View"
          tooltipPosition="top-center"
        >
          <View color={blue500} />
        </IconButton>
        <IconButton
          onTouchTap={() => {
            deleteAction(rowData);
          }}
          tooltip="Delete"
          tooltipPosition="top-center"
        >
          <Delete color={red500} />
        </IconButton>
      </div>
    );
  }
}

export default NotifActions;
