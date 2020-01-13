import React, { Component } from "react";
import { Image, View } from "react-native";
import { PermissionsAndroid } from "react-native";
// import imgd from './img/imgd.png';
// import imgg from './img/imgg.png';

import { StyleSheet, Text } from "react-native";

import QRCodeScanner from "react-native-qrcode-scanner";

export default class Test extends Component {
  constructor(props) {
    super(props);
    this.state = { indication: " ", color: "black", granted: false };
  }
  square = x => {
    return x * x;
  };

  componentDidMount() {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    );
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
  }

  onSuccess = e => {
    if (e.data == "sight-study") {
      var distance = 30;
      var eps = 0.5;
      var tmp = Math.sqrt(
        this.square(e.bounds.origin[1].y - e.bounds.origin[0].y) +
          this.square(e.bounds.origin[1].x - e.bounds.origin[0].x)
      );
      tmp =
        tmp +
        Math.sqrt(
          this.square(e.bounds.origin[2].y - e.bounds.origin[1].y) +
            this.square(e.bounds.origin[2].x - e.bounds.origin[1].x)
        );
      tmp =
        tmp +
        Math.sqrt(
          this.square(e.bounds.origin[0].y - e.bounds.origin[2].y) +
            this.square(e.bounds.origin[0].x - e.bounds.origin[2].x)
        );
      tmp = -0.05357 * tmp + 43.3929;
      // console.log(tmp)
      if (tmp < distance - eps)
        this.setState({ indication: "s'éloigner", color: "black" });
      else {
        if (tmp > distance + eps)
          this.setState({ indication: "se rapprocher", color: "black" });
        else
          this.setState({ indication: "PARFAIT BOUGE PAS BB", color: "green" });
      }
    } else console.log("pas bon qr code");
  };

  render() {
    return (
      <QRCodeScanner
        onRead={this.onSuccess}
        vibrate={false}
        reactivate={true}
        showMarker={true}
        containerStyle={styles.marker}
        customMarker={<Marker />}
        cameraType="front"
        bottomContent={
          <Text style={styles.buttonText}>{this.state.indication}</Text>
        }
      />
    );
  }
}

function Marker() {
  return (
    <Image
      style={{ width: "100%", height: "100%" }}
      tintColor="black"
      source={require("../assets/imgd.png")}
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
    color: "rgb(255,255,255)"
  },
  buttonTouchable: {
    padding: 16
  },
  marker: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center"
  }
});
