import React, { Component } from 'react';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { Container } from 'react-grid-system'
import { List, ListItem } from 'material-ui/List';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import userImage from '../../images/user-icon.png';
import { browserHistory } from 'react-router'
import { getPermissions } from '../../actions/actions';

class UserPermissions extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount() {
    this.props.getPermissions();
  }
  
  render() {
    let renderElement = <h1> User permissions view is being loaded... </h1>;
    let perms = this.props.permissions;
    if (perms) {
      renderElement =
        <Container fluid={true}>
          <h1 className="page-title">
            <img src={userImage} height="40"/>
            User permissions
          </h1>
          <Card className="card">
            <h2> You have access to the following resources: </h2>
            {this.props.permissions.map(p => <pre> {p.resource + (p.scopes? ': ' + p.scopes.reduce((acc, v) => acc + ", " + v): "") }</pre>)}
          </Card>
        </Container>
    }

    return (
      <div className="sensor">
        {renderElement}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
    return {
      permissions: (ownProps.params.userId == state.user.user.id? state.permissions.permissions: null)
    }
}

function mapDispatchToProps(dispatch) {
  return {
    getPermissions: () => {dispatch(getPermissions()) }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPermissions);
