import React, { Component } from "react";
import gatewayImage from "../../images/gateway.png";
import PropTypes from "prop-types";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import AddGatewayForm from "./AddGatewayForm.js";
import Button from "@material-ui/core/Button";
import { Link } from "react-router";

export default class GatewayCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalEditGateway: false
    };
  }

  render() {
    let gateway = this.props.gateway;

    return (
      <Card className={"card"}>
        <AddGatewayForm
          gateway={gateway}
          isEdit={true}
          modalOpen={this.state.modalEditGateway}
          handleClose={() => this.setState({ modalEditGateway: false })}
          onSubmit={gateway => {
            this.props.updateGateway(gateway);
          }}
        />
        <div className="TypographyDiv">
          <div className="cardTitleIcons">
          {/* {this.props.permission && this.props.permission.scopes.includes('gateways:update') ? 
            <EditIcon
              onClick={() => {
                this.setState({ gateway: gateway }),
                  this.setState({ modalEditGateway: true });
              }}
            />: null} */}
            {this.props.permission && this.props.permission.scopes.includes('gateways:update') ?
            <DeleteIcon
              onClick={() => {
                if (window.confirm("Delete gateway?"))
                  this.props.deleteGateway(gateway.id);
              }}
            />: null}
          </div>
          <pre className="Typography"> {gateway.name ? gateway.name : ""}</pre>
        </div>
        <div className="cardContent">
          <img src={gatewayImage} height="90" />
        </div>
      </Card>
    );
  }

  static propTypes = {
    gateway: PropTypes.object, //Should be a Waziup.Actuator
    isEditable: PropTypes.bool,
    isDetails: PropTypes.bool,
    updateGateway: PropTypes.func,
    deleteGateway: PropTypes.func,
    permission: PropTypes.object.isRequired
  };
}
