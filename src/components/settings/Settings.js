import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container } from 'react-grid-system';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import settingsImage from '../../images/settings.png';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

  }

  componentWillMount() {
  }

  componentWillUnmount() {
  }
  
  componentWillReceiveProps(nextProps) { 
  }

  render() {
    return (
      <Container fluid>
        <AppBar position="static" style={{marginBottom: '30px',background: '#e9edf2'}}>
          <Toolbar>
          <img src={settingsImage} height="50"/>
            <Typography variant="h5" className="page-title">
              Settings       
            </Typography>
          </Toolbar>
        </AppBar>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings
  };
}

const mapDispatchToProps= {
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Settings));
