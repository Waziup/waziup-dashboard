import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import { Container } from 'react-grid-system';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { browserHistory } from 'react-router';
import userImage from '../../images/user-icon.png';
import { getDevicePermissions } from '../../actions/actions';

class UserPermissions extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.props.getDevicePermissions();
  }

  render() {
    let renderElement = (
      <h1>
        {' '}
User permissions view is being loaded...
        {' '}
      </h1>
    );
    const perms = this.props.permissions;
    if (perms) {
      renderElement = (
        <Container fluid>
          <h1 className="page-title">
            <img height="40" src={userImage} />
            User permissions
          </h1>
          <Card className="card">
            <h2>
              {' '}
You have access to the following resources:
              {' '}
            </h2>
            {this.props.permissions.map(p => (
              <pre>
                {' '}
                {p.resource + (p.scopes ? `: ${p.scopes.reduce((acc, v) => `${acc}, ${v}`)}` : '') }
              </pre>
            ))}
          </Card>
        </Container>
      );
    }

    return (
      <div className="device">
        {renderElement}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return { permissions: ownProps.params.userId == state.user.user.id ? state.permissions.permissions : null };
}

function mapDispatchToProps(dispatch) {
  return {
    getDevicePermissions: () => {
      dispatch(getDevicePermissions());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserPermissions);
