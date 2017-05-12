import React from 'react'
import PropTypes from 'prop-types'
import {PageHeader, Panel, Well, ListGroupItem, ListGroup} from 'react-bootstrap';

const User = ({userInfo}) => (
  <div>
  <PageHeader>User Information and Security Tokens <small> </small></PageHeader>
  <Panel collapsible defaultExpanded header="User Information" bsStyle="primary">
    <ListGroup >
      <ListGroupItem>
        <Well> 
          Subject: {userInfo.subject}
        </Well>
      </ListGroupItem>
      <ListGroupItem>
        <Well>
        Realm Access: {JSON.stringify(userInfo.realmAccess)}
        </Well>
      </ListGroupItem>
      <ListGroupItem>
        <Well>
        Resource Access: {JSON.stringify(userInfo.resourceAccess)}
        </Well>
      </ListGroupItem>
      <ListGroupItem>
        <Well>
        Response Mode: {userInfo.responseMode}
        </Well>
      </ListGroupItem>
      <ListGroupItem>
        <Well>
        Flow: {userInfo.flow}
        </Well>
      </ListGroupItem>
      <ListGroupItem>
        <Well>
        Response Type: {userInfo.responseType}
        </Well>
      </ListGroupItem>
    </ListGroup>
  </Panel>
  <Panel collapsible defaultExpanded header="Security Tokens" bsStyle="success">
    <ListGroup >
      <ListGroupItem> 
        <Well>
        ID Token Parsed: {JSON.stringify(userInfo.idTokenParsed)}
        </Well>
      </ListGroupItem>
      <ListGroupItem> 
        <Well> 
          Refresh Token Parsed: {JSON.stringify(userInfo.refreshTokenParsed)}
        </Well>
      </ListGroupItem>
      <ListGroupItem> 
        <Well>
          Token Parsed: 
          {JSON.stringify(userInfo.tokenParsed)}
        </Well>
      </ListGroupItem>
      <ListGroupItem> <Well> Refresh Token: 
        {userInfo.refreshToken}
        </Well>
      </ListGroupItem>
    </ListGroup>
  </Panel>
  </div>)

User.propTypes = {
      userInfo: PropTypes.object.isRequired
}

export default User