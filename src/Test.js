import React, { Component } from "react";
import { Image, View } from "react-native";
import { PermissionsAndroid } from "react-native";
import { StyleSheet, Text } from "react-native";

import { getDistance, getTolerance } from "./util";
import QRCodeScanner from "react-native-qrcode-scanner";

export default class Test extends Component {
  constructor(props) {
    super(props)
    this.state = { indication : ' ' ,
                   color : 'black', 
                   wellPlacedCount : 0, 
                   wrongEyeCount : 0,
                   eye : '',
                   distance: 0,
                   decalage: 0
    }
    this.props.navigation.navigate = this.props.navigation.navigate.bind(this);
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.willFocusSub = this.props.navigation.addListener(
      "willFocus",
      async () => {
        this.setState({
          distance: await getDistance(),
          decalage: await getTolerance(),
          'eye': navigation.getParam('eye')
        });
      }
    );  
  }
  
  componentWillUnmount() {
    this.willFocusSub.remove();
  }

  square = (x) => {
    return x*x
  }

  // colorCalcul = (limit, distance, target) => {
  //   var x = Math.abs(target-distance)
  //   if (x<limit){
  //     var d1=parseInt(-255*x/parseFloat(limit)+255)
  //     var d2=parseInt(255*x/parseFloat(limit))
  //     this.setState({'color' : 'rgb(' + d1 + ', 0,' + d2 + ')'})
  //   }
  //   else this.setState({'color' : "rgb(0,0,255)"})
  // }

  onSuccess = (e) => {
    if (e.data == "sight-study"){
      var distance = this.state.distance
      var eps = this.state.decalage
      var wellPlacedInaRow = 10
      var limit = 0
      if (this.state.eye=='left') limit = Math.min(e.bounds.origin[0].y, e.bounds.origin[0].y, e.bounds.origin[0].y);
      else limit = Math.max(e.bounds.origin[0].y, e.bounds.origin[0].y, e.bounds.origin[0].y);

      if ((limit < e.bounds.height/2 && this.state.eye=='left') || (limit > e.bounds.height/2 && this.state.eye=='right')){
        var tmp = Math.sqrt(this.square(e.bounds.origin[1].y - e.bounds.origin[0].y) + this.square(e.bounds.origin[1].x - e.bounds.origin[0].x))
        tmp = tmp + Math.sqrt(this.square(e.bounds.origin[2].y - e.bounds.origin[1].y) + this.square(e.bounds.origin[2].x - e.bounds.origin[1].x))
        tmp = tmp + Math.sqrt(this.square(e.bounds.origin[0].y - e.bounds.origin[2].y) + this.square(e.bounds.origin[0].x - e.bounds.origin[2].x))
        tmp = 7520/tmp
        console.log(tmp-distance-eps)
        console.log(tmp-distance-eps>0)

        if (tmp<distance-eps) this.setState({'indication' : "Eloignez vous de\n" + parseInt(10*Math.abs(distance-tmp))/10. + " cm", 'color' : 'black', 'wellPlacedCount' : 0, 'wrongEyeCount' : 0 })
        else{
          if (tmp-distance-eps>0) this.setState({'indication' : "Rapprochez vous de\n" + parseInt(10*Math.abs(distance-tmp))/10. + " cm", 'color' : 'black', 'wellPlacedCount' : 0, 'wrongEyeCount' : 0})
          else this.setState({'indication' : "Parfait, ne bougez plus", 'wellPlacedCount' : this.state.wellPlacedCount+1, 'color' : 'green', 'wrongEyeCount' : 0})
        }
      } else {
        this.setState({ wrongEyeCount: this.state.wrongEyeCount + 1 });
      }
    } else console.log("pas bon qr code");

    if (this.state.wrongEyeCount >= 4) this.setState({'indication' : "Veuillez tester le bon oeuil", 'color' : 'black', 'wellPlacedCount' : 0})
    if (this.state.wellPlacedCount >= wellPlacedInaRow) this.props.navigation.replace('TestScreen', {eye: this.state.eye})
  }

  render() {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      const { navigation } = this.props;
      const { color } = this.state;
      var img
      if (navigation.getParam('eye') == 'left') img = require('../assets/imgleft.png')
      else img = require('../assets/imgright.png')
    return (
      <QRCodeScanner
        onRead={this.onSuccess}
        vibrate={false}
        reactivate={true}
        showMarker={true}
        containerStyle={styles.marker}
        customMarker={<Marker color={color} img={img} />}
        cameraType="front"
        bottomContent={
          <Text style={styles.buttonText}>{this.state.indication}</Text>
        }
      />
    );
  }
}

function Marker({ color, img }) {
  return (
    <Image
      style={{ width: "250%", height: "250%", marginTop: "40%" }}
      tintColor={color}
      source={img}
    />
  );
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: "#777"
  },
  textBold: {
    fontWeight: "500",
    color: "#000"
  },
  buttonText: {
    fontSize: 21,
    color: "rgb(255,255,255)",
    textAlign: 'center'
  },
  buttonTouchable: {
    padding: 16
  },
  marker: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  }
});
