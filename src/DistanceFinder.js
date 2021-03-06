import React, { Component } from "react";
import { Image, View, Button, Dimensions } from "react-native";
import { PermissionsAndroid } from "react-native";
import { StyleSheet, Text } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import * as Speech from "expo-speech";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";
import { getQrSize } from "./util";
import * as Progress from 'react-native-progress';

// Fonction de calcul pour la distance oeil-camera
// utile pour trouver la distance oeil-lettre
function getTmpDistance(bounds) {
  const { origin } = bounds;
  const d = (x, y) => x * x + y * y;
  let tmp = Math.sqrt(d(origin[1].x - origin[0].x, origin[1].y - origin[0].y));
  tmp += Math.sqrt(d(origin[2].x - origin[1].x, origin[2].y - origin[1].y));
  tmp += Math.sqrt(d(origin[0].x - origin[2].x, origin[0].y - origin[2].y));
  return (3030 * bounds.width)/(640*tmp);
}

export default class DistanceFinder extends Component {
  constructor(props) {
    super(props);
    const backRoute = props.navigation.getParam("backRoute", undefined);
    this.state = {
      wellPlacedCount: 0,
      distance: 0,
      qrsize: 0,
      lastDistance: 0,
      timer: null,
      counter: 0,
      lastTime: -2,
      img: require("../assets/asterix1.png"),
      backRoute : backRoute.toString()
    };
    this.handleOnOk = this.handleOnOk.bind(this);
  }

  // Fonction appelee lors d'une detection de QR Code.
  // Calcule la distance du QR Code,
  // s'il est detecte 10 fois d'affile a eps cm pres,
  // alors la distance de l'utilisateur est celle-ci.
  onSuccess = e => {
    var wellPlacedInaRow = 10;

    
    if (this.state.wellPlacedCount < wellPlacedInaRow) {
      if (e.data === "sight-study") {

        // Calcul de la distance oeil-lettre
        const tmp = (this.state.qrsize * getTmpDistance(e.bounds)) / 3;

        var centre =
          e.bounds.width / 2 -
          (parseFloat(e.bounds.origin[0].x) +
            parseFloat(e.bounds.origin[1].x) +
            parseFloat(e.bounds.origin[2].x)) /
            3;
        var h =
          tmp *
          Math.sin((Math.PI * 35.84 * centre) / ((e.bounds.width / 2) * 180));
        var letterToCamera =
          (2.54 * Dimensions.get("window").height) /
          (Dimensions.get("window").scale * 160);
        var dis = Math.sqrt(
          letterToCamera * letterToCamera + tmp * tmp - 2 * 12.5 * h
        );
        this.setState({ lastDistance: parseInt(10 * dis) / 10 });

        // Si la distance est à 10% pres de la distance premierement detectee,
        // on lui rajoute une detection, sinon elle devient la nouvelle distance a detecter
        var eps = this.state.distance * 0.1;
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
    // Verification des authorisations
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.CAMERA
    ]);

    // Desactive la mise en veille de l'ecran
    activateKeepAwake();

    // Timer pour le diaporama d'images et le contrôle de la detection de l'utilisateur dans le champs
    this.timer = setInterval(this.tick, 1000);
    this.setState({
      qrsize: await getQrSize(),
      timer: this.timer
    });
    this.tick();

    Speech.speak("Veuillez vous placer confortablement devant l'écran.", {
      language: "fr"
    });
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  // Change l'image affichee toutes les 10 secondes
  // Le compteur permet aussi de determiner si l'ulisateur n'est pas dans le champs de la camera
  tick = () => {
    var c = (parseInt(this.state.counter / 10) % 4) + 1;
    this.setState({
      counter: this.state.counter + 1,
      img: images[c]
    });
  };


  handleOnOk() {
    const { lastDistance, backRoute } = this.state;
    const { navigate } = this.props.navigation;

    // Reactive la mise en veille de l'ecran
    deactivateKeepAwake();

    // Transmet la distance a la page de creation du patient
    navigate(backRoute, { distance: lastDistance });
  }

  render() {
    const {
      img,
      lastDistance,
      wellPlacedCount,
      counter,
      lastTime
    } = this.state;
    return (
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>

        {/* Scanner pour le QR Code  */}
        <QRCodeScanner
          onRead={this.onSuccess}
          vibrate={false}
          reactivate={true}
          containerStyle={{ position: "absolute", opacity: 0 }}
          cameraType="front"
        />

        {/* Barre de progression */}
        <Progress.Bar style={{position: "absolute", top: "20%"}} progress={this.state.wellPlacedCount/10} width={400} height={20} borderRadius={8} />
        
        {/* Image pour tester la distance naturelle */}
        <ImageTest img={img} />

        {/* Si la distance est determinee, on l'affiche
        Si ca fait au moins 2sec que le QR Code n'a pas ete trouvé, on affiche un message */}
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

// Adresses des differentes images
const images = {
  1: require("../assets/asterix1.png"),
  2: require("../assets/asterix2.png"),
  3: require("../assets/asterix3.png"),
  4: require("../assets/asterix4.png")
};

// Affichage de l'image courante,
// img: image courante
function ImageTest({ img }) {
  return (
    <Image
      style={{ position: "absolute", width: "90%", resizeMode: "contain" }}
      source={img}
    />
  );
}

// Affichage de la distance une fois determinee
// distance : distance determinee
// handleOnOk : fonction appelee lors de l'appuie sur "OK"
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
