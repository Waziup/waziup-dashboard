import React, { Component } from "react";
import {
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";
import PropTypes from "prop-types";
import * as Waziup from "waziup-js";
import { GraphLoader } from "./Loaders";
import * as Utils from "../utils";

class DataChart extends Component {
  constructor(props) {
    super(props);
  }

  compareTime = (a, b) => {
    if (a.time < b.time) {
      return -1;
    }
    if (a.time > b.time) {
      return 1;
    }
    return 0;
  };

  render() {
    //condensing the data into triples: [{id: "MyDevice -> TC", time: 654561321, value: 25}]
    let dataTriples = this.props.values.map((val) => {
      let time = {};
      switch (this.props.timeAxis) {
        case "cloud":
          time = val.date_received;
          break;
        case "device":
          time = val.timestamp;
          break;
        default:
          time = val.date_received;
          break;
      }
      let unixtime = new Date(time).valueOf();
      return {
        id: val.device_id + " -> " + val.sensor_id,
        time: unixtime,
        value: val.value,
      };
    });

    //sort by time (Cloud timestamp doesn't need sorting)
    const sorted =
      this.props.timeAxis == "device"
        ? dataTriples.sort(this.compareTime)
        : dataTriples;

    //grouping by ids. Ex: [{name: "MyDevice -> TC", data: [{id: XX, time: XX, value: XX}]}]
    const groupById = groupBy("id");
    const grouped = groupById(sorted);
    const grouped2 = Object.keys(grouped).map((id, index) => {
      return { name: id, data: grouped[id] };
    }); //.sort((a,b) => !this.compareTime(a,b))

    const xFormatter = (unixtime) =>
      moment(unixtime).format("MMMM Do YYYY H:mm:ss a z");
    const yFormatter = (val) => val;

    var YLabel = "Sensor values";
    if (this.props.sens) {
      const QK = Waziup.QuantityKinds.getLabel(this.props.sens.quantity_kind);
      const unit = Waziup.Units.getLabel(this.props.sens.unit);
      YLabel = QK + (unit ? " (" + unit + ")" : "");
    }
    if (this.props.values) {
      let colorCodes = [
        "#17607D",
        "#1FCECB",
        "#FF9311",
        "#003D5C",
        "#F27649",
        "#D5CDB6",
        "#008C74",
        "#30588C",
        "#263138",
      ];
      return (
        <ResponsiveContainer
          height={500}
          style={{ margin: 30, width: "100px" }}
        >
          <LineChart margin={{ top: 50, right: 0, left: 0, bottom: 15 }}>
            <XAxis
              domain={["dataMin", "dataMax"]}
              dataKey="time"
              type="number"
              allowDuplicatedCategory={false}
              tickFormatter={xFormatter}
            />
            <YAxis
              dataKey="value"
              label={{ value: YLabel, angle: -90, position: "insideLeft" }}
            />
            <Tooltip formatter={yFormatter} labelFormatter={xFormatter} />
            <CartesianGrid strokeDasharray="3 3" />
            {grouped2.map((line, index) => (
              <Line
                name={line.name}
                data={line.data}
                type="monotone"
                stroke={colorCodes[index]}
                strokeWidth={2}
                dot={{ stroke: colorCodes[index], r: 1 }}
                connectNulls={true}
                isAnimationActive={false}
                key={line.name}
                dataKey="value"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );
    } else {
      return null;
    }
  }

  static propTypes = {
    sens: PropTypes.object, //template sensor (if all sensors have the same type). Should be a Waziup.Sensor: https://github.com/Waziup/waziup-js/blob/master/docs/Sensor.md
    values: PropTypes.array.isRequired, //Array of values: https://github.com/Waziup/waziup-js/blob/master/docs/SensorValues.md
    timeAxis: PropTypes.string, // Either 'cloud' or 'device'
  };

  static testProps = {
    sens: {
      quantity_kind: "AirTemperature",
      unit: "DegreeCelsius",
    },
    values: [
      {
        sensor_id: "TC1",
        device_id: "MyDevice90",
        value: 26,
        timestamp: "2020-02-12T16:21:27Z",
        date_received: "2020-02-28T16:21:27Z",
      },
      {
        sensor_id: "TC1",
        device_id: "MyDevice90",
        value: 25,
        timestamp: "2020-02-12T16:21:27Z",
        date_received: "2020-02-12T16:21:27Z",
      },
      {
        sensor_id: "TC1",
        device_id: "MyDevice90",
        value: 26,
        timestamp: "2020-02-12T16:21:27Z",
        date_received: "2020-02-13T16:21:27Z",
      },
      {
        sensor_id: "TC2",
        device_id: "MyDevice90",
        value: 20,
        timestamp: "2020-02-12T16:21:27Z",
        date_received: "2020-02-28T16:21:27Z",
      },
      {
        sensor_id: "TC2",
        device_id: "MyDevice90",
        value: 25,
        timestamp: "2020-02-12T16:21:27Z",
        date_received: "2020-02-12T16:21:27Z",
      },
      {
        sensor_id: "TC2",
        device_id: "MyDevice901",
        value: 21,
        timestamp: "2020-02-12T16:21:27Z",
        date_received: "2020-02-13T16:21:27Z",
      },
    ],
    timeAxis: "cloud",
  };
}

export default DataChart;
