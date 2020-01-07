import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  PixelRatio,
  Dimensions,
  Button
} from "react-native";
import { AsyncStorage } from "react-native";
import { removeOrientationChangeListener } from "expo/build/ScreenOrientation/ScreenOrientation";

var letters = ["N", "C", "K", "Z", "O", "R", "H", "S", "D", "V"];
var intervalId = null;
var lettres = 50 ;

export default class TestScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      counter : this.getRandomInt(10),
      taille_ligne : Math.floor(100 * PixelRatio.get() * 5* 0.4 * Math.tan( Math.pow(10, 1.0)/60.0)),
      lettre : 10,
      score_oeil_droit : 0,
      score_oeil_gauche : 0
    };
  }

  componentDidMount() {
    console.log(this.state.lettre)
    var intervalId = setInterval(()=>{
      this.setState({counter:this.getRandomInt(10),lettre : this.state.lettre-1});
      if(this.state.lettre%2==0){
        this.setState({taille_ligne :(this.state.taille_ligne * (1/1.2599))})
      }
      if(this.state.lettre==0){
        clearInterval(intervalId)
        this.setState({taille_ligne :Math.floor(100 * PixelRatio.get() * 5* 0.4 * Math.tan( Math.pow(10, 1.0)/60.0))})
      }

    },1000);
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }


  render() {
    if(this.state.lettre!=0)
    return (
      <View>
        <Text style={{ color: 'black',textAlign:'center',fontWeight: "900" , fontSize: this.state.taille_ligne}}>
          {letters[this.state.counter]}
        </Text>
      </View>
    );
    else return(
      <View>
        <Text style={{ color: 'black',textAlign:'center',fontWeight: "900" , fontSize: this.state.taille_ligne}}>
          FIN DU TEST
        </Text>
      </View>
    )
  }
}

