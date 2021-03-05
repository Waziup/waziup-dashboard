import React, { Component } from "react";
import actuatorImage from "../../../../images/actuator.png";
import PropTypes from "prop-types";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import ActuatorForm from "./ActuatorForm";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import locale from "react-json-editor-ajrm/locale/en";
import JSONInput from "react-json-editor-ajrm";
import Button from "@material-ui/core/Button";
import { Link } from "react-router";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

const styles = {
  container: {
    width: "100%"
  },
  body: {
    width: undefined,
    display: "flex"
  },
  outerBox: {
    width: "100%",
    minWidth: "250px"
  },
  contentBox: {
    width: undefined,
    flex: 1
  },
  warningBox: {
    width: "100%"
  }
};

const colors = {
  default: "black",
  background: "white",
  background_warning: "black",
  number: "black",
  string: "red",
  keys_whiteSpace: "black",
  primitive: "black"
};

export default class ActuatorCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalEdit: false,
      modalActuate: false,
      actu: this.props.actuator ? this.props.actuator : defaultActu,
      valid: true,
      validNumber: true
    };
  }

  componentWillMount() {
    this.updateValue();
  }

  updateValue() {
    var actu = this.state.actu;
    if (this.state.actu.actuator_value_type == "bool") {
      actu["value"] = Boolean(this.state.actu.value);
    } else if (this.state.actu.actuator_value_type == "number") {
      actu["value"] = isNaN(this.state.actu.value)
        ? 0
        : Number(this.state.actu.value);
    } else if (this.state.actu.actuator_value_type == "string") {
      actu["value"] = String(this.state.actu.value) || "";
    }
    this.setState({ actu: actu });
  }

  updateValueType(valueType) {
    var actu = this.state.actu;
    actu["actuator_value_type"] = valueType;
    this.setState({ actu: actu });
  }

  submitActuator(m) {
    this.props.updateActuatorName(this.props.deviceId, m.id, m.name);
    this.props.updateActuatorKind(this.props.deviceId, m.id, m.actuator_kind);
    this.props.updateActuatorValueType(
      this.props.deviceId,
      m.id,
      m.actuator_value_type
    );
    this.updateValueType(m.actuator_value_type);
    this.updateValue();
  }

  submitValue() {
    if (
      this.state.actu.actuator_value_type === "number" &&
      isNaN(this.state.actu.value)
    ) {
      this.setState({ validNumber: false });
    } else {
      this.setState({ validNumber: true });
      this.props.updateActuatorValue(
        this.props.deviceId,
        this.state.actu.id,
        JSON.stringify(this.state.actu.value)
      );
    }
  }

  onActuateClick() {
    this.props.updateActuatorValue(
      this.props.deviceId,
      this.state.actu.id,
      "null"
    );
  }

  handleChange = formData => {
    var actu = this.state.actu;
    actu["value"] = formData.target.value;
    this.setState({ actu: actu });
  };

  handleSwitchChange = event => {
    var actu = this.state.actu;
    actu.value = Boolean(event.target.checked);
    this.setState({ actu: actu });
    this.submitValue();
  };

  handleJSONInputChange = data => {
    var actu = this.state.actu;
    actu["value"] = data.jsObject;
    this.setState({ actu: actu });
    this.setState({ valid: !data.error });
  };

  render() {
    const { classes } = this.props;
    let actu = this.props.actuator;
    const sampleObject = { key: "value" };
    const sampleArray = ["one", "two"];

    return (
      <Card className={"card "}>
        <ActuatorForm
          modalOpen={this.state.modalEdit}
          handleClose={() => {
            this.setState({ modalEdit: false });
          }}
          onSubmit={a => {
            this.submitActuator(a);
            this.setState({ modalEdit: false });
          }}
          isEdit={true}
          actuator={JSON.parse(JSON.stringify(actu))}
        />
        <div className="TypographyDiv">
          <pre className="Typography">
            {" "}
            {actu.name ? actu.name : "(" + actu.id + ")"}{" "}
          </pre>
          <div className="cardTitleIcons">
            {this.props.permission.scopes.includes("devices:update") ? (
              <EditIcon onClick={() => this.setState({ modalEdit: true })} />
            ) : null}
            {this.props.permission.scopes.includes("devices:update") ? (
              <DeleteIcon
                onClick={() => {
                  if (window.confirm("Delete actuator?"))
                    this.props.deleteActuator(this.props.deviceId, actu.id);
                }}
              />
            ) : null}
          </div>
        </div>
        {this.props.isDetails ? (
          <div className="cardContent">
              <div className="sensIcon">
                <img src={actuatorImage} height="75" />
              </div>
              {this.props.permission.scopes.includes("devices:update") ? (
                <CardActions>
                  <Grid
                    container
                    spacing={24}
                    justify="flex-end"
                    direction="row"
                  >
                    <Grid item xs={12}>
                      {this.state.actu.actuator_value_type == "string" ? (
                        <TextField
                          id="stringValue"
                          name="stringValue"
                          label="Value"
                          fullWidth
                          value={this.state.actu.value}
                          onChange={this.handleChange}
                          helperText="Provide a string"
                        />
                      ) : (
                        ""
                      )}
                      {this.state.actu.actuator_value_type == "number" ? (
                        <TextField
                          error={!this.state.validNumber}
                          id="numberValue"
                          name="numberValue"
                          label="Value"
                          fullWidth
                          value={this.state.actu.value}
                          onChange={this.handleChange}
                          helperText={
                            this.state.validNumber
                              ? "Provide a number"
                              : "Please enter a number value"
                          }
                        />
                      ) : (
                        ""
                      )}
                      {this.state.actu.actuator_value_type == "bool" ? (
                        <FormControlLabel
                          control={
                            <Switch
                              id="boolValue"
                              name="boolValue"
                              checked={this.state.actu.value}
                              onChange={this.handleSwitchChange}
                              value={this.state.actu.value}
                              color="primary"
                            />
                          }
                          label="Actuator Value"
                        />
                      ) : (
                        ""
                      )}
                      {this.state.actu.actuator_value_type == "null" ? (
                        <Button
                          variant="contained"
                          onTouchTap={() => {
                            this.onActuateClick();
                          }}
                        >
                          Actuate
                        </Button>
                      ) : (
                        ""
                      )}
                      {this.state.actu.actuator_value_type == "object" ? (
                        <Paper>
                          <div style={{ maxWidth: "100%", maxHeight: "100%" }}>
                            <JSONInput
                              id="objectValue"
                              name="objectValue"
                              placeholder={sampleObject}
                              onChange={this.handleJSONInputChange}
                              theme="light_mitsuketa_tribute"
                              locale={locale}
                              colors={colors}
                              height="150px"
                              style={styles}
                            />
                          </div>
                        </Paper>
                      ) : (
                        ""
                      )}
                      {this.state.actu.actuator_value_type == "array" ? (
                        <Paper>
                          <div style={{ maxWidth: "100%", maxHeight: "100%" }}>
                            <JSONInput
                              id="arrayValue"
                              name="arrayValue"
                              placeholder={sampleArray}
                              onChange={this.handleJSONInputChange}
                              theme="light_mitsuketa_tribute"
                              locale={locale}
                              colors={colors}
                              height="150px"
                              style={styles}
                            />
                          </div>
                        </Paper>
                      ) : (
                        ""
                      )}
                    </Grid>
                    {this.state.actu.actuator_value_type != "null" &&
                      this.state.actu.actuator_value_type != "bool" && (
                        <Grid
                          item
                          xs={12}
                          container
                          justify="flex-end"
                          direction="row"
                        >
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            disabled={!this.state.valid}
                            onTouchTap={() => {
                              this.submitValue();
                            }}
                          >
                            Submit
                          </Button>
                        </Grid>
                      )}
                  </Grid>
                </CardActions>
              ) : null}
            </div>)
          :
            <div className="cardContent">
              <Link to={"/devices/" + this.props.deviceId + "/actuators/" + actu.id}>
                <div className="actuIcon">
                  <img
                    src={actuatorImage}
                    height="75"
                    title={"Go to actuator details"}
                  />
                </div>
              </Link>
              <div className="sensValue"> 
                <h3> {this.state.actu.value} </h3>
              </div>
            </div>
          }
      </Card>
    );
  }

  static propTypes = {
    actu: PropTypes.object, //Should be a Waziup.Actuator
    isEditable: PropTypes.bool,
    isDetails: PropTypes.bool,
    updateActuator: PropTypes.func,
    updateActuatorName: PropTypes.func,
    updateActuatorKind: PropTypes.func,
    updateActuatorValue: PropTypes.func,
    updateActuatorValueType: PropTypes.func,
    deleteActuator: PropTypes.func,
    deviceId: PropTypes.string.isRequired,
    permission: PropTypes.object.isRequired
  };
}
