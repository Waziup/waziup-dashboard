import { connect } from 'react-redux';
import sensorDetail from './sensorDetail.js';



function mapStateToProps(state) {
    return {
      sensors: state.example.data,
    }
}

function mapDispatchToProps(dispatch) {
    return {}
}
const sensorDetailContainer = connect( mapStateToProps,mapDispatchToProps)(sensorDetail);
export default sensorDetailContainer;
