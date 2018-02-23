
import React, {Component} from 'react';
import IconButton from 'material-ui/IconButton';
import { Link } from 'react-router';
import Delete from 'material-ui/svg-icons/action/delete';
import Update from 'material-ui/svg-icons/content/create';
import View from 'material-ui/svg-icons/image/remove-red-eye';
import {blue500, red500 } from 'material-ui/styles/colors';

class NotifActions extends Component {
  render() {
    let {rowData, deleteAction, updateAction} = this.props;
    return (
        <div>
           <IconButton tooltip="View" tooltipPosition="top-center" containerElement={<Link to={"/notifications/" + rowData.id} />} >
              <View color={blue500}/>
           </IconButton>
           <IconButton tooltip="Delete" tooltipPosition="top-center" onTouchTap={()=>{deleteAction(rowData)}}>
              <Delete  color={red500}/>
           </IconButton>
        </div>
    );
  }
}

export default NotifActions;
