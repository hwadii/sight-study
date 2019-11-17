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

var letters = ["N", "C", "K", "Z", "O", "R", "H", "S", "D", "V"];

export default class TestScreen extends Component {
  constructor(props) {}

  render() {
    return (
      <View>
        <Text>Test Screen</Text>
      </View>
    );
  }
}
