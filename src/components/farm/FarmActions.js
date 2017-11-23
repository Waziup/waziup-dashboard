import React, { Component } from 'react';
import IconButton from 'material-ui/IconButton';
import { Link } from 'react-router';
import Delete from 'material-ui/svg-icons/action/delete';
import Update from 'material-ui/svg-icons/content/create';
import View from 'material-ui/svg-icons/image/remove-red-eye';
import AccessAlarmIcon from 'material-ui/svg-icons/device/access-alarm';
import { blue500, red500 } from 'material-ui/styles/colors';

/*           <IconButton tooltip="Delete" tooltipPosition="top-center" onTouchTap={()=>{deleteAction(rowData.id)}}>
              <Delete  color={red500}/>
           </IconButton>*/

class FarmActions extends Component {
  render() {
    let { rowData, eventAction, updateAction } = this.props;
    return (
      <div>
        <IconButton tooltip="Farm View" tooltipPosition="top-center" containerElement={<Link to={"/farmview/" + rowData.id} />} >
          <View color={blue500} />
        </IconButton>

        <IconButton tooltip="Create Event For Farm" tooltipPosition="top-center" onTouchTap={() => { eventAction(rowData) }} >
          <AccessAlarmIcon color={red500} />
        </IconButton>

        <IconButton tooltip="Update Farm" tooltipPosition="top-center" onTouchTap={() => { updateAction(rowData) }}>
          <Update />
        </IconButton>
      </div>
    );
  }
}

export default FarmActions;