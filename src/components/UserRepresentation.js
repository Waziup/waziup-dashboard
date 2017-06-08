import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Alert, Panel, Well} from 'react-bootstrap';
import { userRepReq } from '../actions/securityActions'

// ListGroupItem, ListGroup, ButtonToolbar, ButtonGroup, Button, Glyphicon


class UserRepresentation extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    //this.props.security.
    dispatch(userRepReq())
  }

  render() {
    const security = this.props.security
    const userRepReq = security.userRepReq
    const userRepRes = security.userRepRes
    const userRepErrMsg = security.userRepErrMsg
    //userRep

    return (
        (userRepReq === true) ? (<Well> UserRepresentation are being loaded. </Well> ):
         ((userRepRes === true) ?
         (<Panel collapsible defaultExpanded header={<h3>User Representation </h3>} >
         {}
         </Panel>): 
         (<Alert bsStyle="warning">
              <strong>Error</strong> happened during fetching UserRepresentation: <br/> {userRepErrMsg}.
          </Alert>))
      )
  }
}

const mapStateToProps = state => {
  return {security: state.security}
}

export default connect(mapStateToProps)(UserRepresentation)