import React, { Component } from "react";
import { Image, View } from "react-native";
import { PermissionsAndroid } from "react-native";
import { StyleSheet, Text } from "react-native";

import QRCodeScanner from "react-native-qrcode-scanner";

import { setDistance } from "../service/db/User";
import { getId } from "./util";

export default class distanceFinder extends Component {
  constructor(props) {
    super(props)
    this.state = { id: 0,
                   indication : ' ' ,
                   wellPlacedCount : 0, 
                   distance: 0,
                   timer: null,
                   counter: 1,
                   img: require('../assets/asterix1.png')
    }
    this.props.navigation.navigate = this.props.navigation.navigate.bind(this);
  }

  square = (x) => {
    return x*x
  }

  onSuccess = (e) => {
    var wellPlacedInaRow = 10
    var eps=1

    if (this.state.wellPlacedCount >= wellPlacedInaRow) {
        this.setState({'distance': parseInt(10*this.state.distance)/10 })
        setDistance(this.state.id, this.state.distance)
    }
    else{
        if (e.data == "sight-study"){

            var tmp = Math.sqrt(this.square(e.bounds.origin[1].y - e.bounds.origin[0].y) + this.square(e.bounds.origin[1].x - e.bounds.origin[0].x))
            tmp = tmp + Math.sqrt(this.square(e.bounds.origin[2].y - e.bounds.origin[1].y) + this.square(e.bounds.origin[2].x - e.bounds.origin[1].x))
            tmp = tmp + Math.sqrt(this.square(e.bounds.origin[0].y - e.bounds.origin[2].y) + this.square(e.bounds.origin[0].x - e.bounds.origin[2].x))
            tmp = 7520/tmp
            console.log(tmp)

            if (Math.abs(this.state.distance-tmp) < eps) this.setState({'wellPlacedCount': this.state.wellPlacedCount+1})
            else this.setState({'distance': tmp, 'wellPlacedCount': 0})
            
        } else console.log("pas bon qr code");
    }
}

componentDidMount(){
    let timer = setInterval(this.tick, 10000);
    this.setState({timer, counter: Math.floor(Math.random() * 10)%4+1});
    this.tick();
    this.willFocusSub = this.props.navigation.addListener(
        "willFocus",
        async () => {
          this.setState({
            id: await getId()
          });
        }
      );  
  }
  
tick =() => {
    var c = ((this.state.counter-1) + 1)%4 + 1
    this.setState({
      counter: c,
      img: images[c]
    });
  }

  render() {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      const { img } = this.state;
    return (
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
      <QRCodeScanner
        onRead={this.onSuccess}
        vibrate={false}
        reactivate={true}
        containerStyle={{opacity: 0}}
        cameraType="front"
      />
      <Text style={styles.buttonText}>{this.state.indication}</Text>
      <ImageTest img={img} />
      </View>
    );
  }
}

const images = {
    1: require("../assets/asterix1.png"),
    2: require("../assets/asterix2.png"),
    3: require("../assets/asterix3.png"),
    4: require("../assets/asterix4.png")
   }

function ImageTest({ img }) {
  return (
    <Image
      style={{ position: "absolute", width: "90%" , resizeMode: "contain" }}
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
    position: 'relative',
    fontSize: 21,
    color: "rgb(0,0,0)",
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
