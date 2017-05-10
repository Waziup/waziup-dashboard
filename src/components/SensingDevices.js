import React, { Component } from 'react'
import { connect } from 'react-redux'

class SensingDevices extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sensingDevice: false,
    }
  }
              
// <p> Device ID: {device.id}  {JSON.stringify(device)}   </p>
        //   sensingDevice.listDevices.map((device)  => {
        //     var deviceEntry = '';
        //     for(let key in device) {
        //         deviceEntry += <p> {JSON.stringify(key)} : {JSON.stringify(device[key])} </p>
        //     }
        //     return deviceEntry
        //   })
        // }

  render() {
    const sensingDevice = this.props.sensingDevice
    const isFetching = sensingDevice.isFetching
    return (
      <div>
        {(isFetching === true)? <p> Sensing Devices are being loaded. </p> :
        <p>
          for(var device in sensingDevice.listDevices)
            <p> JSON.stringify(device) : JSON.stringify(sensingDevice.listDevices[device]) </p>
        
        </p>
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  console.log("state.sensingDevice in SensingDevices:" + JSON.stringify(state.sensingDevice));
  return { sensingDevice: state.sensingDevice }
}

export default connect(mapStateToProps)(SensingDevices)