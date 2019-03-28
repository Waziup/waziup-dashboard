import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gauge from '../../../images/gauge.png';
import thermometer from '../../../images/thermometer.png';
import accelerometer from '../../../images/accelerometer.png';
import humidity from '../../../images/humidity.png';
import gps from '../../../images/gps.png';
import atmospheric_pressure from '../../../images/atmospheric_pressure.png';

export default class SensIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    var icon = null
    switch(this.props.sensor_kind) {
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
      case "HumidityDevice":                  
      case "AirHumidityDevice":     
      case "SoilHumidityDevice":              
        icon = humidity; break;
      case "AtmosphericPressureDevice":      
        icon = atmospheric_pressure; break;
      case "GPSDevice":            
        icon = gps; break;
      case "AirPollutantDevice":              
      case "AlcoholLevelDevice":              
      case "BloodPressureDevice":             
      case "BoardVoltageDevice":              
      case "CholesterolDevice":               
      case "Clock":                           
      case "CloudCoverDevice":                
      case "CO2Device":                       
      case "ConductivityDevice":              
      case "CODevice":                        
      case "Counter":                         
      case "CurrentDevice":                   
      case "DeltaDewPointDevice":             
      case "DeviceUptimeClock":               
      case "DewPointDevice":                  
      case "DirectionOfArrivalDevice":        
      case "DistanceNextVehicleDevice":       
      case "DistanceDevice":                  
      case "DoorStateDevice":                 
      case "DustDevice":                      
      case "ElectricalDevice":                
      case "ElectricFieldDevice":             
      case "EnergyMeter":                     
      case "FallDetector":                    
      case "FrequencyDevice":                 
      case "FuelLevel":                       
      case "FuelConsumptionDevice":           
      case "GasDetector":                     
      case "GaseousPollutantDevice":          
      case "Glucometer":                      
      case "GyroscopeDevice":                 
      case "HeartBeatDevice":                 
      case "HumanPresenceDetector":           
      case "Hydrophone":                      
      case "ImageDevice":                     
      case "LeafWetnessDevice":               
      case "LightDevice":                     
      case "LoRaInterfaceEnergyMeter":        
      case "Magnetometer":                    
      case "MotionDevice":                    
      case "NH3Device":                       
      case "NO2Device":                       
      case "NODevice":                        
      case "O3Device":                        
      case "Odometer":                        
      case "OpticalDustDevice":               
      case "OxidationReductionPotentialDevice":
      case "OxygenDevice":                    
      case "OtherDevice":                     
      case "Pedometer":                       
      case "PeopleCountDevice":               
      case "PHDevice":                        
      case "PrecipitationDevice":             
      case "PresenceDetector":                
      case "PressureDevice":                  
      case "ProximityDevice":                 
      case "PulseOxymeter":                   
      case "RadiationParticleDetector":       
      case "RainFallDevice":                  
      case "SaltMeter":                       
      case "Seismometer":                     
      case "SkinConductanceDevice":           
      case "SmokeDetector":                   
      case "SO2Device":                       
      case "SolarRadiationDevice":            
      case "SoundDevice":                     
      case "SpeedDevice":                     
      case "SunPositionDirectionDevice":      
      case "SunPositionElevationDevice":      
      case "TimeOfArrivalNextVehicleDevice":   
      case "TimeOfArrivalDevice":              
      case "TouchDevice":                     
      case "UltrasonicDevice":                 
      case "VehicleCountDevice":               
      case "VehiclePresenceDetector":          
      case "VisibilityDevice":                
      case "VOCDevice":                       
      case "VoiceCommandDevice":              
      case "VoltageDevice":                   
      case "WasteLevelDevice":                
      case "WaterLevel":                      
      case "WaterConductivityDevice":         
      case "WaterNH4IonDevice":               
      case "WaterNO3IonDevice":               
      case "WaterO2IonDevice":                
      case "WaterPHDevice":                   
      case "WaterPollutantDevice":            
      case "WeightDevice":                    
      case "WiFiInterfaceEnergyMeter":        
      case "WindChillDevice":                 
      case "WindDirectionDevice":             
      case "WindSpeedDevice":                
      default:
        icon = gauge; break;
    }

    return (
        <img src={icon} height={this.props.height} title={this.props.title}/>
    );
  }
                                                                                                                                  
  static propTypes = {
    sensor_kind: PropTypes.string, //Should be a Waziup.Device
    title: PropTypes.string,
    height: PropTypes.string
  }
}
