import React, { Component } from "react";
import { Image, View, Button, Dimensions } from "react-native";
import { PermissionsAndroid } from "react-native";
import { StyleSheet, Text } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import * as Speech from "expo-speech";

function getTmpDistance(bounds) {
  const { origin } = bounds;
  const d = (x, y) => x * x + y * y;
  let tmp = Math.sqrt(d(origin[1].x - origin[0].x, origin[1].y - origin[0].y));
  tmp += Math.sqrt(d(origin[2].x - origin[1].x, origin[2].y - origin[1].y));
  tmp += Math.sqrt(d(origin[0].x - origin[2].x, origin[0].y - origin[2].y));
  return 3030/tmp;
}

export default class DistanceFinder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wellPlacedCount: 0,
      distance: 0,
      lastDistance: 0,
      timer: null,
      counter: 0,
      lastTime: -2,
      img: require("../assets/asterix1.png")
    };
    this.handleOnOk = this.handleOnOk.bind(this);
  }

  onSuccess = e => {
    var wellPlacedInaRow = 10;
    var eps = 1;

    if (this.state.wellPlacedCount < wellPlacedInaRow) {
      if (e.data === "sight-study") {
        const tmp = getTmpDistance(e.bounds);

        var centre = e.bounds.width/2 - (parseFloat(e.bounds.origin[0].x) + parseFloat(e.bounds.origin[1].x) + parseFloat(e.bounds.origin[2].x))/3
        var h = tmp*Math.sin(Math.PI*35.84*centre/(e.bounds.width/2*180))
        var letterToCamera = 2.54*Dimensions.get('window').height/(Dimensions.get('window').scale*160)
        var dis = Math.sqrt(letterToCamera*letterToCamera+tmp*tmp-2*12.5*h)
        this.setState({lastDistance: parseInt(10 * dis) / 10})

        if (Math.abs(this.state.distance - dis) < eps)
          this.setState({
            wellPlacedCount: this.state.wellPlacedCount + 1,
            lastTime: this.state.counter
          });
        else
          this.setState({
            distance: parseInt(10 * dis) / 10,
            wellPlacedCount: 0,
            lastTime: this.state.counter
          });
      } else console.log("pas bon qr code");
    }
  };

  async componentDidMount() {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    );
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    this.timer = setInterval(this.tick, 1000);
    this.setState({
      timer: this.timer
    });
    this.tick();
    Speech.speak("Veuillez vous placer confortablement devant l'écran.", { language: "fr" });
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  tick = () => {
    var c = (parseInt(this.state.counter / 10) % 4) + 1;
    this.setState({
      counter: this.state.counter + 1,
      img: images[c]
    });
  };

  handleOnOk() {
    const { lastDistance } = this.state;
    const { navigate } = this.props.navigation;
    navigate("AddUser", { distance: lastDistance });
  }

  render() {
    const { img, lastDistance, wellPlacedCount, counter, lastTime } = this.state;
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <QRCodeScanner
          onRead={this.onSuccess}
          vibrate={false}
          reactivate={true}
          // containerStyle={{ width:"10%", height:"10%" }}
          cameraStyle={
            counter - lastTime >= 2 ? styles.qr("red") : styles.qr("green")
          }
          cameraType="front"
        />
        <ImageTest img={img} />
        {wellPlacedCount < 10 ? (
          <>
            <Text style={styles.indication}>
              {counter - lastTime >= 2
                ? "Veuillez vous placer confortablement devant l'écran"
                : null}
            </Text>
          </>
        ) : (
          <OnCalculated distance={lastDistance} handleOnOk={this.handleOnOk} />
        )}
      </View>
    );
  }
}

const images = {
  1: require("../assets/asterix1.png"),
  2: require("../assets/asterix2.png"),
  3: require("../assets/asterix3.png"),
  4: require("../assets/asterix4.png")
};

function ImageTest({ img }) {
  return (
    <Image
      style={{ position: "absolute", width: "90%", resizeMode: "contain" }}
      source={img}
    />
  );
}

function OnCalculated({ distance, handleOnOk }) {
  return (
    <View style={styles.indication}>
      <Text style={{ fontSize: 22 }}>
        La distance de lecture idéale calculée est{" "}
        <Text style={{ fontWeight: "bold" }}>{distance} cm</Text>
      </Text>
      <Button title="OK" onPress={() => handleOnOk()} />
    </View>
  );
}

const styles = StyleSheet.create({
  indication: {
    flex: 1,
    position: "absolute",
    justifyContent: "center",
    top: "70%",
    fontWeight: "bold",
    fontSize: 22
  },
  qr: color => ({
    borderStyle: "solid",
    borderColor: color,
    borderWidth: 6,
    height: "22%",
    marginBottom: "90%",
    marginLeft: "10%",
    width: "20%"
  })
});
