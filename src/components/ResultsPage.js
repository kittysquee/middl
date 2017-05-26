import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import axios from 'axios';

class ResultsPage extends Component {
  state = { p1Location: null }

  componentWillMount() {
    axios.get('https://maps.googleapis.com/maps/api/geocode/json?&address=' + this.props.p1)
      .then(response => {
        this.setState({ p1Location: response.data });
        this.setState({ p1Latitude: response.data.results['0'].geometry.location.lat });
        this.setState({ p1Longitude: response.data.results['0'].geometry.location.lng });
        this.setState({ p1Id: response.data.results["0"].place_id })
      })

      .then(response => axios.get('https://maps.googleapis.com/maps/api/geocode/json?&address=' + this.props.p2)
        .then(response => {
          this.setState({ p2Location: response.data });
          this.setState({ p2Latitude: response.data.results['0'].geometry.location.lat });
          this.setState({ p2Longitude: response.data.results['0'].geometry.location.lng });
          this.setState({ p2Id: response.data.results["0"].place_id });
        })
      )

      .then(response => axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=place_id:' + this.state.p1Id + '&destination=place_id:' + this.state.p2Id + '&key=AIzaSyDWck9QLMxciHSmTpLCjeohqFLksN6qZHU')
        .then(response => this.setState({ route: response.data })))

      .then(response => { this.midpoint(this.state.p1Latitude, this.state.p1Longitude, this.state.p2Latitude, this.state.p2Longitude) })

      .then(response => axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + this.state.midDeg + '&radius=500&type=coffee&key=AIzaSyByFVMWrXcFmDawtZV1tqvn0fAXgVZe-DY')
        .then(response => {
          this.setState({ midPlaces: response.data });
          // this.setState({ p2Latitude: response.data.results['0'].geometry.location.lat });
          // this.setState({ p2Longitude: response.data.results['0'].geometry.location.lng });
          // this.setState({ p2Id: response.data.results["0"].place_id });
        })
      )
      ;
  }

  midpoint (lat1, lng1, lat2, lng2) {
      let rad = (Math.PI)/180
      let rlat1 = lat1 * rad;
      let rlng1 = lng1 * rad;
      let rlat2 = lat2 * rad;
      let rlng2 = lng2 * rad;

      let dlng = rlng2 - rlng1;
      let Bx = Math.cos(rlat2) * Math.cos(dlng);
      let By = Math.cos(rlat2) * Math.sin(dlng);

      let lat3 = Math.atan2(Math.sin(rlat1) + Math.sin(rlat2),
                Math.sqrt(((Math.cos(rlat1) + Bx) * (Math.cos(rlat1) + Bx)) + (By * By)));
      let lng3 = rlng1 + Math.atan2(By, (Math.cos(rlat1) + Bx));

      lat = (lat3 * 180) / Math.PI;
      lng = (lng3 * 180)/ Math.PI;
      this.setState({ midDeg: [lat, lng] });
  }

  render() {
    console.log("p1 Latitude: ", Object.prototype.toString.call(this.state.p1Latitude))
    console.log("midDeg: ", Object.prototype.toString.call(this.state.midDeg))
    console.log("midLat: ", this.state.midLat)
    console.log("midLon: ", this.state.midLon)
    console.log("Lat1: ", this.state.p1Latitude)
    console.log("Lon2: ", this.state.p1Longitude)
    console.log("Lat1: ", this.state.p2Latitude)
    console.log("Lon2: ", this.state.p2Longitude)
    console.log("midDeg:", this.state.midDeg)
    console.log('midPlaces: ', this.state.midPlaces)

    return (<View style={styles.container}>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 51.5173,
            longitude: 0.0733,
            latitudeDelta: 0.09,
            longitudeDelta: 0.0421
          }}>
          <MapView.Marker
            coordinate={{
              latitude: this.state.p1Latitude,
              longitude: this.state.p1Longitude
              // latitude: 51.5173,
              // longitude: 0.0733
            }}>
              <View>
                <View style={styles.marker} />
              </View>
            </MapView.Marker>

          </MapView>
      </View>

      <View style={styles.textContainer}>
      </View>

    </View>);
  }
}

const styles = StyleSheet.create({
  marker: {
    height: 20,
    width: 20,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 20 / 2,
    overflow: 'hidden',
    backgroundColor: '#007AFF'
  },
  container: {
    flex: 1
  },
  map: {
    left: 25,
    right: 25,
    top: 25,
    bottom: 25,
    position: 'absolute'
  },
  textContainer: {
    flex: 1
  },
  mapContainer: {
    flex: 1
  }
})

export default ResultsPage;
