import React, { Component } from 'react';
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';

class Mapa extends Component {

  constructor (props){
    super(props)
    this.state = {
        selectedPlace : {
            lat:0, lng: 0
        },
        selected : false

    };
  }

    componentDidMount () {
      this.setState({selected : false})
    }

      open(place, selected) {
        if(place.id !== 0 && selected){
           window.location.href = ``;
        }
      }

      render() {
        return (
            <Map google={this.props.google} zoom={14} initialCenter={{lat : this.props.place.latitude, lng : this.props.place.longitude}} >
                <Marker
                position={{
                    lat: this.props.place.latitude,
                    lng: this.props.place.longitude
                }} onClick={() => {
                  this.setState({selected : true,
                    selectedPlace : this.props.place})
                }}>
                </Marker>
            </Map>
        );
      }
      };
      
      export default GoogleApiWrapper({
        apiKey: (process.env.MAP_API)
      })(Mapa);
