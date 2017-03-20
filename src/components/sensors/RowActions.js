
import React, {Component} from 'react';
import IconButton from 'material-ui/IconButton';
import { Link } from 'react-router';
import Delete from 'material-ui/svg-icons/action/delete';
import Update from 'material-ui/svg-icons/content/create';
import View from 'material-ui/svg-icons/image/remove-red-eye';
import {blue500, red500, greenA200} from 'material-ui/styles/colors';
class RowActions extends Component {
  render() {
    let {deleteAction,updateAction} = this.props.metadata.customComponentMetadata;
    let {rowData} = this.props;
    return (
        <div>
		   <IconButton 
            tooltip="View" 
            tooltipPosition="top-center" 
            containerElement={<Link to={"/sensors/"+rowData.id} />}
            >
			<View color={blue500}/>
		   </IconButton> 
           <IconButton tooltip="Update" tooltipPosition="top-center" onTouchTap={()=>{updateAction(rowData)}}>
			<Update />
		   </IconButton> 
           <IconButton tooltip="Delete" tooltipPosition="top-center" onTouchTap={()=>{deleteAction(rowData)}}>
			<Delete  color={red500}/>
		   </IconButton>
        </div>
    );
  }
}

export default RowActions;
