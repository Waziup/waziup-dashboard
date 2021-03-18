import React, { Component } from "react";
import gatewayImage from "../../images/gateway.png";
import deviceImage from "../../images/device.png";
import PropTypes from "prop-types";
import Card from "@material-ui/core/Card";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import AddGatewayForm from "./AddGatewayForm.js";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router";
import config from '../../config';
import LinkOnIcon from '@material-ui/icons/Link';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import Tooltip from "@material-ui/core/Tooltip";

export default class GatewayNodeCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalEditGateway: false
    };
  }

  render() {
    let gateway = this.props.gateway;    
    let title = gateway.date_modified ? "Date modified: " + gateway.date_modified : "No data yet"

    return (
      <Card className={"longCard"}>
        <AddGatewayForm gateway={gateway}
                        isEdit={true}
                        modalOpen={this.state.modalEditGateway}
                        handleClose={() => this.setState({ modalEditGateway: false })}
                        onSubmit={gateway => {this.props.updateGatewayName(gateway.id, gateway.name);}}/>
        <Grid container
              direction="row"
              justify="flex-start"
              alignItems="left"
              spacing={24}>
          <Grid item md={12} lg={6}>
            <span className="Typography" style={{'vertical-align': "top"}}>
              {" "}
              {gateway.name ? gateway.name : "No name (" + gateway.id +")"}
              {" "}
            </span>
            {gateway.connected ? 
              <Tooltip title="Your gateway is connected!">
                <LinkOnIcon style={{ fontSize: 32, fill: 'green', margin: '10px' }}/>
              </Tooltip>
            : <Tooltip title="Your gateway is not connected.">
                <LinkOffIcon style={{ fontSize: 32, fill: 'red', margin: '10px' }}/>
              </Tooltip>}
          </Grid>
          <Grid item md={12} lg={6}>
            <Typography>
              {this.props.permission &&
              this.props.permission.scopes.includes("gateways:delete") ? (
                <div className="cardTitleIcons">
                  <Hidden mdUp implementation="css">
                    <DeleteIcon
                      onClick={() => {
                        if (window.confirm("Delete a gateway?"))
                          this.props.deleteGateway(gateway.id);
                      }}
                    />
                  </Hidden>
                  <Hidden smDown implementation="css">
                    <Button
                      className="topRightButton"
                      variant="contained"
                      color="primary"
                      onTouchTap={() => {
                        if (window.confirm("Delete a gateway?"))
                          this.props.deleteGateway(gateway.id);
                      }}
                    >
                      Delete
                    </Button>
                  </Hidden>
                </div>
              ) : null}

              {this.props.permission && 
               this.props.permission.scopes.includes("gateways:update") ?
                (<div className="cardTitleIcons">
                  <Hidden mdUp implementation="css">
                    <EditIcon onClick={() => this.setState({ modalEditGateway: true })} />
                  </Hidden>
                  <Hidden smDown implementation="css">
                    <Button
                      className="topRightButton"
                      variant="contained"
                      color="primary"
                      onTouchTap={() => { this.setState({ modalEditGateway: true }) }}>Edit</Button>
                    <Button
                      className="topRightButton"
                      variant="contained"
                      color="primary"
                      onTouchTap={() => { window.open("https://remote.waziup.io/" + gateway.id + "/admin/", '_blank'); 
                                          return null;}}>Remote access</Button>
                  </Hidden>
                </div>) : null}
            </Typography>
          </Grid>
        </Grid>
        <div className="cardContent">
          <div className="boardIcon">
            <img src={gatewayImage} height="90" title={title}/>
            <pre>
              {" "}
              {gateway.owner
                ? "owner: " +
                  gateway.owner +
                  (this.props.user && gateway.owner == this.props.user.username
                    ? " (you)"
                    : "")
                : ""}{" "}
            </pre>
            <pre>
              {" "}
              {"visibility: " +
                (gateway.visibility ? gateway.visibility : "public")}{" "}
              {" "}
            </pre>
            <pre>
              {"ID: " + gateway.id}
            </pre>
          </div>
          {gateway.devices
            ? gateway.devices.map((dev, index) => {
                return (
                  <Link to={"/devices/" + dev.id}>
                    <Card className="card" key={index}>
                      <div className="TypographyDiv">
                        <pre className="Typography"> {dev.name} </pre>
                      </div>
                      <div className="cardContent">
                        <div className="leftIcon">
                          <img src={deviceImage} height="64" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })
            : null}
        </div>
      </Card>
    );
  }

  static propTypes = {
    gateway: PropTypes.object, 
    isEditable: PropTypes.bool,
    isDetails: PropTypes.bool,
    updateGatewayName: PropTypes.func,
    deleteGateway: PropTypes.func,
    permission: PropTypes.object.isRequired
  };
}
