import React, {Component} from 'react';
import FlatButton from 'material-ui/FlatButton';

class SensorOwner extends Component {
  render() {
      let own = "-";
      if (this.props.rowData.owner) {
       own = this.props.rowData.owner.value; 
      }else if(this.props.rowData.Owner){
       own = this.props.rowData.Owner.value; 
      }
    return (
        <div>
          <FlatButton label={own} />
        </div>
    );
  }
}

export default SensorOwner;

