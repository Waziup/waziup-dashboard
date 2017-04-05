import * as d3 from "d3";
import axios from 'axios'

// Build data for a classic bar chart
const data = {}
// Labels are displayed in component, quantities are calculated to define height of each bar


//curl -s -S --header 'Accept: application/json' --header 'Fiware-Service: waziup' --header 'Fiware-ServicePath: /FL'  


// var ds2 = d3.json(url)
//     .header("Accept", "application/json")
//     .header("Fiware-Service", "waziup")
//     .header("Fiware-ServicePath", "/FL")
//     .get(function callback(error, json) {
//    // var ds = [];
//     console.debug("callback: json in info");

var ds2 = [];
const querystring = require('query-string');
var url='http://historicaldata.waziup.io/STH/v1/contextEntities/type/SensingDevice/id/Device_6/attributes/temperature';
axios.get(url,
    {
    params: {'lastN': '10'},
    headers: {
    'Fiware-ServicePath':"/FL",
    'Fiware-Service':"waziup",
    "Accept": "application/json"
    }})
    .then(function(response) {
        console.log(response);
        var contextResponse0 = response.data.contextResponses[0];
        const {contextElement: contextElement} = contextResponse0;
        const attribute0 = contextElement.attributes[0];
        const values = attribute0.values;
        console.log("Temperature:" + attribute0.name);

        for (var i in values) {
            var value = values[i];
            console.log(value.attrValue + "  ,  " + value.recvTime);
            ds2.push({"label": value.recvTime.toString(), "value":value.attrValue});
        }
        console.log("inside" + JSON.stringify(ds2));  
    })
    .catch(function(response){
        console.log("ERROR");
        console.log(response);      
    })

data.dataSet = ds2;

//Set margins for bar graph within svg element
data.margins = {top: 20, right: 20, bottom: 70, left: 40};

//Define label of y-axis
data.yAxisLabel = 'Temperature (Celsious)';

// Colors are optional for each bar
// If colors are not given, bars will default to 'steelblue'
data.fill = [];

//Define the width of the svg element on the page
data.width = 960;

//Define the height of the bar chart
data.height = 700;

// Define tick intervals for y-axis
data.ticks = 10;

//Define a class for the svg element for styling
data.barClass = 'bar';

/* EXAMPLE CSS
.bar text {
  font: 14px sans-serif;
  text-anchor: middle;
}
*/

export default data;
