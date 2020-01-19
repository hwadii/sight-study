import React, { Component } from "react";
import { Image, View, Button } from "react-native";
import { PermissionsAndroid } from "react-native";
import { StyleSheet, Text } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import { roundToNearestMinutesWithOptions } from "date-fns/esm/fp";

function getTmpDistance(bounds) {
  const { origin } = bounds;
  const d = (x, y) => x * x + y * y;
  let tmp = Math.sqrt(d(origin[1].x - origin[0].x, origin[1].y - origin[0].y));
  tmp += Math.sqrt(d(origin[2].x - origin[1].x, origin[2].y - origin[1].y));
  tmp += Math.sqrt(d(origin[0].x - origin[2].x, origin[0].y - origin[2].y));
  return 7520 / tmp;
}

export default class DistanceFinder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wellPlacedCount: 0,
      distance: 0,
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
        if (Math.abs(this.state.distance - tmp) < eps)
          this.setState({ wellPlacedCount: this.state.wellPlacedCount + 1, lastTime: this.state.counter });
        else this.setState({ distance: parseInt(10 * tmp) / 10, wellPlacedCount: 0, lastTime: this.state.counter });
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
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  tick = () => {
    var c = parseInt(this.state.counter/10)%4+1
    this.setState({
      counter: this.state.counter+1,
      img: images[c]
    });
  };

  handleOnOk() {
    const { distance } = this.state;
    const { navigate } = this.props.navigation;
    navigate("AddUser", { distance });
  }

  render() {
    const { img, distance, wellPlacedCount } = this.state;
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <QRCodeScanner
          onRead={this.onSuccess}
          vibrate={false}
          reactivate={true}
          // containerStyle={{ width:"10%", height:"10%" }}
          cameraStyle={this.state.counter-this.state.lastTime>=2 ? qr("red") : qr("green")}
          cameraType="front"
        />
        {wellPlacedCount < 10 ? (
          <ImageTest img={img} />
        ) : (
          <OnCalculated distance={distance} handleOnOk={this.handleOnOk} />
        )}
        <Text style={styles.indication}>
          {this.state.counter-this.state.lastTime>=2 ? "Veuillez vous placer devant l'écran" : ""}
        </Text>
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
    <View style={styles.marker}>
      <Text style={{ fontSize: 22 }}>
        La distance de lecture idéale calculée est{" "}
        <Text style={{ fontWeight: "bold" }}>{distance} cm</Text>
      </Text>
      <Button title="OK" onPress={() => handleOnOk()} />
    </View>
  );
}

qr = function(color) {
  return {
    borderStyle: "solid", 
    borderColor: color, 
    borderWidth: 6,
    height: "22%", 
    marginBottom: "90%", 
    marginLeft: "10%", 
    width: "20%"
  }
}

const styles = StyleSheet.create({
  marker: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute"
  },
  indication:{
    flex: 1,
    position: "absolute",
    justifyContent: "center",
    top: "70%",
    fontWeight: "bold",
    fontSize: 22
  }
});
