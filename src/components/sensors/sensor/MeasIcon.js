import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gauge from '../../../images/gauge.png';
import thermometer from '../../../images/thermometer.png';
import accelerometer from '../../../images/accelerometer.png';
import humidity from '../../../images/humidity.png';
import gps from '../../../images/gps.png';
import atmospheric_pressure from '../../../images/atmospheric_pressure.png';

export default class MeasIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    var icon = null
    switch(this.props.sensing_device) {
      case "AirThermometer":                  
      case "BoardThermometer":                
      case "BodyThermometer":                 
      case "RoadSurfaceThermometer":          
      case "SoilThermometer":                 
      case "Thermometer":                      
      case "WaterThermometer":                
        icon = thermometer; break;
      case "Accelerometer":
        icon = accelerometer; break;
      case "HumiditySensor":                  
      case "AirHumiditySensor":     
      case "SoilHumiditySensor":              
        icon = humidity; break;
      case "AtmosphericPressureSensor":      
        icon = atmospheric_pressure; break;
      case "GPSSensor":            
        icon = gps; break;
      case "AirPollutantSensor":              
      case "AlcoholLevelSensor":              
      case "BloodPressureSensor":             
      case "BoardVoltageSensor":              
      case "CholesterolSensor":               
      case "Clock":                           
      case "CloudCoverSensor":                
      case "CO2Sensor":                       
      case "ConductivitySensor":              
      case "COSensor":                        
      case "Counter":                         
      case "CurrentSensor":                   
      case "DeltaDewPointSensor":             
      case "DeviceUptimeClock":               
      case "DewPointSensor":                  
      case "DirectionOfArrivalSensor":        
      case "DistanceNextVehicleSensor":       
      case "DistanceSensor":                  
      case "DoorStateSensor":                 
      case "DustSensor":                      
      case "ElectricalSensor":                
      case "ElectricFieldSensor":             
      case "EnergyMeter":                     
      case "FallDetector":                    
      case "FrequencySensor":                 
      case "FuelLevel":                       
      case "FuelConsumptionSensor":           
      case "GasDetector":                     
      case "GaseousPollutantSensor":          
      case "Glucometer":                      
      case "GyroscopeSensor":                 
      case "HeartBeatSensor":                 
      case "HumanPresenceDetector":           
      case "Hydrophone":                      
      case "ImageSensor":                     
      case "LeafWetnessSensor":               
      case "LightSensor":                     
      case "LoRaInterfaceEnergyMeter":        
      case "Magnetometer":                    
      case "MotionSensor":                    
      case "NH3Sensor":                       
      case "NO2Sensor":                       
      case "NOSensor":                        
      case "O3Sensor":                        
      case "Odometer":                        
      case "OpticalDustSensor":               
      case "OxidationReductionPotentialSensor":
      case "OxygenSensor":                    
      case "OtherSensor":                     
      case "Pedometer":                       
      case "PeopleCountSensor":               
      case "PHSensor":                        
      case "PrecipitationSensor":             
      case "PresenceDetector":                
      case "PressureSensor":                  
      case "ProximitySensor":                 
      case "PulseOxymeter":                   
      case "RadiationParticleDetector":       
      case "RainFallSensor":                  
      case "SaltMeter":                       
      case "Seismometer":                     
      case "SkinConductanceSensor":           
      case "SmokeDetector":                   
      case "SO2Sensor":                       
      case "SolarRadiationSensor":            
      case "SoundSensor":                     
      case "SpeedSensor":                     
      case "SunPositionDirectionSensor":      
      case "SunPositionElevationSensor":      
      case "TimeOfArrivalNextVehicleSensor":   
      case "TimeOfArrivalSensor":              
      case "TouchSensor":                     
      case "UltrasonicSensor":                 
      case "VehicleCountSensor":               
      case "VehiclePresenceDetector":          
      case "VisibilitySensor":                
      case "VOCSensor":                       
      case "VoiceCommandSensor":              
      case "VoltageSensor":                   
      case "WasteLevelSensor":                
      case "WaterLevel":                      
      case "WaterConductivitySensor":         
      case "WaterNH4IonSensor":               
      case "WaterNO3IonSensor":               
      case "WaterO2IonSensor":                
      case "WaterPHSensor":                   
      case "WaterPollutantSensor":            
      case "WeightSensor":                    
      case "WiFiInterfaceEnergyMeter":        
      case "WindChillSensor":                 
      case "WindDirectionSensor":             
      case "WindSpeedSensor":                
      default:
        icon = gauge; break;
    }

    return (
        <img src={icon} height={this.props.height} title={this.props.title}/>
    );
  }
                                                                                                                                  
  static propTypes = {
    sensing_device: PropTypes.string, //Should be a Waziup.Sensor
    title: PropTypes.string,
    height: PropTypes.string
  }
}
