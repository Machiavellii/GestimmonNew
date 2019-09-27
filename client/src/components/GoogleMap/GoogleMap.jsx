import React from 'react';
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  InfoWindow,
  Marker
} from 'react-google-maps';
import Autocomplete from 'react-google-autocomplete';
import Geocode from 'react-geocode';

Geocode.setApiKey('AIzaSyDdEEBDB0M6ttt4QhEbYYRiL0DDPUGp9Os');
Geocode.enableDebug();

export const AsyncMap = withScriptjs(
  withGoogleMap(props => (
    <GoogleMap
      //   google={this.props.google}
      defaultZoom={10}
      defaultCenter={{
        lat: 32,
        lng: 34
      }}
      // scrollwheel={false}
      // zoomControl={true}
      options={{
        gestureHandling: 'greedy'
      }}
    >
      {/* For Auto complete Search Box */}

      {/*Marker*/}
      {/* <Marker
          google={this.props.google}
          name={"Dolores park"}
          draggable={true}
          onDragEnd={this.onMarkerDragEnd}
          position={{
            lat: this.state.markerPosition.lat,
            lng: this.state.markerPosition.lng
          }}
        />
        <Marker />
        <InfoWindow
          onClose={this.onInfoWindowClose}
          position={{
            lat: this.state.markerPosition.lat + 0.0018,
            lng: this.state.markerPosition.lng
          }}
        > 
          <div>
            <span style={{ padding: 0, margin: 0 }}>{this.state.address}</span>
          </div>
        </InfoWindow>
        */}
    </GoogleMap>
  ))
);
class GoogleMapManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      city: '',
      area: '',
      state: '',
      mapPosition: {
        lat: 32,
        lng: 32
      },
      markerPosition: {
        lat: 32,
        lng: 32
      }
    };
  }

  //   shouldComponentUpdate(nextProps, nextState) {
  //     if (
  //       this.state.markerPosition.lat !== this.props.center.lat ||
  //       this.state.address !== nextState.address ||
  //       this.state.city !== nextState.city ||
  //       this.state.area !== nextState.area ||
  //       this.state.state !== nextState.state
  //     ) {
  //       return true;
  //     } else if (this.props.center.lat === nextProps.center.lat) {
  //       return false;
  //     }
  //   }

  getCity = addressArray => {
    let city = '';
    for (let i = 0; i < addressArray.length; i++) {
      if (
        addressArray[i].types[0] &&
        'administrative_area_level_2' === addressArray[i].types[0]
      ) {
        city = addressArray[i].long_name;
        return city;
      }
    }
  };

  getArea = addressArray => {
    let area = '';
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types[0]) {
        for (let j = 0; j < addressArray[i].types.length; j++) {
          if (
            'sublocality_level_1' === addressArray[i].types[j] ||
            'locality' === addressArray[i].types[j]
          ) {
            area = addressArray[i].long_name;
            return area;
          }
        }
      }
    }
  };

  getState = addressArray => {
    let state = '';
    for (let i = 0; i < addressArray.length; i++) {
      for (let i = 0; i < addressArray.length; i++) {
        if (
          addressArray[i].types[0] &&
          'administrative_area_level_1' === addressArray[i].types[0]
        ) {
          state = addressArray[i].long_name;
          return state;
        }
      }
    }
  };

  getAddressByPosition = (lat, lng) => {
    Geocode.fromLatLng(lat, lng).then(
      response => {
        console.log('Geocode res: ', response);
        const address = response.results[0].formatted_address,
          addressArray = response.results[0].address_components,
          city = this.getCity(addressArray),
          area = this.getArea(addressArray),
          state = this.getState(addressArray);

        console.log('city', city, area, state);

        this.setState({
          address: address ? address : '',
          area: area ? area : '',
          city: city ? city : '',
          state: state ? state : ''
        });
      },
      error => {
        console.error(error);
      }
    );
  };

  onPlaceSelected = () => {};

  render() {
    return (
      <AsyncMap
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBlvYXYZ8UtR-LOAZDS4M0C3v4VLPKpono&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: '100%' }} />}
        containerElement={<div style={{ display: 'flex', height: 400 }} />}
        mapElement={<div style={{ margin: 20, width: '100%' }} />}
        // onPlaceSelected = {this.onPlaceSelected}
      />
    );
  }
}

export default GoogleMapManager;
