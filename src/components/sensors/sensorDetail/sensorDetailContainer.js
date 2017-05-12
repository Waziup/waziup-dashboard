import { connect } from 'react-redux';
import sensorDetail from './sensorDetail.js';
import {fetchSensors, adminLogin} from '../../../actions/actions';



function mapStateToProps(state) {
    return {
      sensors: state.sensors.sensors,
      user: state.keycloak.idTokenParsed,
      currentUser:state.currentUser.currentUser,
    }
}

function mapDispatchToProps(dispatch) {
    return {
    fetchSensors:(service, servicePath)=>{dispatch(fetchSensors(service, servicePath))},
    adminLogin:(user)=>{dispatch(adminLogin(user))},
    }
}
const sensorDetailContainer = connect( mapStateToProps,mapDispatchToProps)(sensorDetail);
export default sensorDetailContainer;
