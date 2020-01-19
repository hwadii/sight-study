import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  PixelRatio,
  Dimensions,
  Button,
  TouchableOpacity
} from "react-native";
import { AsyncStorage } from "react-native";
import { removeOrientationChangeListener } from "expo/build/ScreenOrientation/ScreenOrientation";
import * as Speech from "expo-speech";

var letters = ["N", "C", "K", "Z", "O", "R", "H", "S", "D", "V"];
var intervalId = null;
var lettres = 50;

export default class TestScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      counter: this.getRandomInt(10),
      taille_ligne: Math.floor(100 * PixelRatio.get() * 5 * 0.4 * Math.tan(Math.pow(10, 1.0) / 60.0)),
      lettre: 10,
      score_oeil_droit: 0,
      score_oeil_gauche: 0
    };
    this.Explication = this.Explication.bind(this)
  }

  Explication(oeil) {
    if (oeil == "droit") {
      Speech.speak("Vous allez passer le test, le test commencera par l'oeil droit, veillez couvrir votre oeil gauche, Une fois prêt appuyer sur le bouton Lancer le test", { language: "fr" })
      return(
        <View style={styles.container}>
        <Text style={styles.headers}>Test de Vison</Text>
        <Text style={styles.text}>Vous aller passer le test</Text>
        <Text style={styles.text}>Le test commencera par l'oeil droit</Text>
        <Text style={styles.textunder}>Veillez couvrir votre oeil gauche</Text>
    
        <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => console.log("go")}
        >
            <Text style={styles.confirmButtonText}>LANCER LE TEST</Text>
          </TouchableOpacity>
      </View>
       )
    }
    if (oeil == "gauche") {
      Speech.speak("Vous avez terminer le test de l'oeil droit, Nous allons maintenant evaluer votre oeil gauche, veillez maintenat couvrir votre oeil droit, Une fois prêt appuyer sur le bouton continuer le test", { language: "fr" })
      return (
        <View style={styles.container}>
          <Text style={styles.headers}>Test de Vison</Text>
          <Text style={styles.text}>Nous allons evaluer votre oeil gauche</Text>
          <Text style={styles.textunder}>Veillez couvrir votre oeil droit</Text>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => console.log("go")}
        >
            <Text style={styles.confirmButtonText}>CONTINUER LE TEST</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  componentDidMount() {
    console.log(this.state.lettre)
    this.Explication("droit")
    var intervalId = setInterval(() => {
      this.setState({ counter: this.getRandomInt(10), lettre: this.state.lettre - 1 });
      if (this.state.lettre % 2 == 0) {
        this.setState({ taille_ligne: (this.state.taille_ligne * (1 / 1.2599)) })
      }
      if (this.state.lettre == 0) {
        clearInterval(intervalId)
        this.setState({ taille_ligne: Math.floor(100 * PixelRatio.get() * 5 * 0.4 * Math.tan(Math.pow(10, 1.0) / 60.0)) })
      }

    }, 1000);
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }


  render() {
    if (this.state.lettre != 0)
      return (
        <View>
          <Text style={{ color: 'black',textAlign:'center',fontWeight: "900" , fontSize: this.state.taille_ligne}}>
            {letters[this.state.counter]}
          </Text>
        </View>
        
      );
    else return (
      <View>
        <Text style={{ color: 'black', textAlign: 'center', fontWeight: "900", fontSize: this.state.taille_ligne }}>
          FIN DU TEST
        </Text>
      </View>
    )

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 15
  },
  headers: {
    fontSize: 60,
    fontWeight: "bold",
    margin: 10
  },
  text:{
    fontSize: 40,
    margin: 10,
    justifyContent:'center'
  },
  textunder:{
    fontSize: 40,
    margin: 10,
    textDecorationLine:"underline"
  },
  confirmButton: {
    borderWidth: 1,
    borderColor: "#007BFF",
    backgroundColor: "#007BFF",
    padding: 10,
    marginTop: 3
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 40,
    textAlign: "center"
  }
})