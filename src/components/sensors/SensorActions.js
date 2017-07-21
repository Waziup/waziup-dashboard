import React, {Component} from 'react';
import IconButton from 'material-ui/IconButton';
import { Link } from 'react-router';
import Delete from 'material-ui/svg-icons/action/delete';
import Update from 'material-ui/svg-icons/content/create';
import VectorUpdate from 'material-ui/svg-icons/maps/layers';
import View from 'material-ui/svg-icons/image/remove-red-eye';
import {blue500, red500} from 'material-ui/styles/colors';

class SensorActions extends Component {

  render() {
    let {rowData, deleteAction, updateAction, updateVectorAction} = this.props;
    return (
        <div>
           <IconButton tooltip="View" tooltipPosition="top-center" containerElement={<Link to={"/sensors/"+rowData.id} />} >
              <View color={blue500}/>
           </IconButton>
           {
               (rowData.type === 'SensingDevice') &&
                <IconButton tooltip="Update" tooltipPosition="top-center" onTouchTap={()=>{updateAction(rowData)}}>
                  <Update />
               </IconButton>
           }
           {
               (rowData.type === 'Field') &&
                <IconButton tooltip="Update" tooltipPosition="top-center" onTouchTap={()=>{console.log('cuuu'); updateVectorAction(rowData);}}>
                  <VectorUpdate />
                </IconButton>
           }

            <IconButton tooltip="Delete" tooltipPosition="top-center" onTouchTap={()=>{deleteAction(rowData.id)}}>
              <Delete  color={red500}/>
           </IconButton>

        </div>
    );
  }
}

export default SensorActions;
