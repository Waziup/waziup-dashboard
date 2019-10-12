import React, { Component } from "react";
import { connect } from "react-redux";
import { Container } from "react-grid-system";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import * as types from "../../actions/actionTypes";
import * as moment from "moment";
import settingsImage from "../../images/settings.png";
import Button from "@material-ui/core/Button";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ShareIcon from "@material-ui/icons/Share";
import SettingsIcon from "@material-ui/icons/Settings";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";
import { createSocial, getSocials } from "../../actions/actions.js";
import TestForm from './TestForm.js';

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  button: {
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2
  },
  table: {
    minWidth: 700
  }
});

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openTestModal: false,
      channel: '',
      value: 0,
      page: 0,
      rowsPerPage: 5
    };
  }

  componentWillMount() {
    this.props.getSocials();
  }

  componentWillReceiveProps(nextProps) {}

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    const { classes, socials } = this.props;
    const { value } = this.state;

    const { data, rowsPerPage, page } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, socials.length - page * rowsPerPage);

    return (
      <Container fluid>
        <AppBar position="static" color="default">
          <div style={{ background: "#e9edf2" }}>
            <Toolbar>
              <img src={settingsImage} height="50" />
              <Typography variant="h5" className="page-title">
                Settings
              </Typography>
            </Toolbar>
          </div>
          <Tabs
            value={value}
            onChange={this.handleChange}
            variant="scrollable"
            scrollButtons="on"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Config" icon={<SettingsIcon />} />
            <Tab label="Social" icon={<ShareIcon />} />
          </Tabs>
        </AppBar>
        {value === 0 && (
          <TabContainer>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    id="boolValue"
                    name="boolValue"
                    checked={this.props.settings.allowManualCreateResources}
                    onChange={(v) => {console.log(v.target.checked); this.props.setSettings( {...this.props.settings, allowManualCreateResources : v.target.checked})}}
                    value={this.props.settings.allowManualCreateResources}
                    color="primary"
                  />
                }
              label="Allow manual creation of gateways and devices (recommended: off)"
              title="The WAZIUP gateway will create everything automatically for you, so you normally don't need this option."
              />
              <FormControlLabel
                control={
                  <Switch
                    id="showPublicResources"
                    name="showPublicResources"
                    checked={this.props.settings.showPublicResources}
                    onChange={v => {
                      console.log(v.target.checked);
                      this.props.setSettings({
                        ...this.props.settings,
                        showPublicResources: v.target.checked
                      });
                    }}
                    value={this.props.settings.showPublicResources}
                    color="primary"
                  />
                }
                label="Show public resources"
              />
            </FormGroup>
          </TabContainer>
        )}
        {value === 1 && (
          <TabContainer>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => { this.setState({ channel: "sms", openTestModal: true }) }}
            >
              Test SMS
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={() => { this.setState({ channel: "twitter", openTestModal: true }) }}
            >
              Test Twitter
            </Button>
            <Paper className={classes.root}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    <TableCell align="right">Channel</TableCell>
                    <TableCell align="right">Message</TableCell>
                    <TableCell align="right">Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {socials
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow key={row.id}>
                        <TableCell component="th" scope="row">
                          {page * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell align="right">{row.channel}</TableCell>
                        <TableCell align="right">{row.message}</TableCell>
                        <TableCell align="right">
                          {moment(row.timestamp).format("LLL")}
                        </TableCell>
                      </TableRow>
                    ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 49 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={socials.length}
                rowsPerPage={rowsPerPage}
                page={page}
                backIconButtonProps={{
                  "aria-label": "Previous Page"
                }}
                nextIconButtonProps={{
                  "aria-label": "Next Page"
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </Paper>
          </TabContainer>
        )}
        <TestForm
          channel={this.state.channel}
          handleClose={() => this.setState({ openTestModal: false })}
          modalOpen={this.state.openTestModal}
          onSubmit={s => this.props.createSocial(s)}
          user={this.props.user}
        />
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    settings: state.settings,
    socials: state.socials.socials,
    user: state.current_user.username
  };
}

const mapDispatchToProps = dispatch => {
  return {
    setSettings: settings => dispatch({ type: types.SET_SETTINGS, settings }),
    getSocials: () => {
      dispatch(getSocials());
    },
    createSocial: (data) => {
      dispatch(createSocial(data));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Settings));
