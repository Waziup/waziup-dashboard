import React, {Component} from 'react';
import IconButton from 'material-ui/IconButton';
import { Link } from 'react-router';
import Delete from 'material-ui/svg-icons/action/delete';
import Update from 'material-ui/svg-icons/content/create';
import View from 'material-ui/svg-icons/image/remove-red-eye';
import {blue500, red500, greenA200} from 'material-ui/styles/colors';

class SensorActions extends Component {
  
  constructor(props) {
    super(props)
  }

  render() {
    let {rowData, deleteAction, updateAction} = this.props;
    return (
        <div>
           <IconButton tooltip="View" tooltipPosition="top-center" containerElement={<Link to={"/sensors/"+rowData.id} />} >
              <View color={blue500}/>
           </IconButton> 
           <IconButton tooltip="Update" tooltipPosition="top-center" onTouchTap={()=>{updateAction(rowData)}}>
              <Update />
           </IconButton> 
           <IconButton tooltip="Delete" tooltipPosition="top-center" onTouchTap={()=>{deleteAction(rowData.id)}}>
              <Delete  color={red500}/>
           </IconButton>
        </div>
    );
  }
}

export default SensorActions;
