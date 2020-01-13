import React, { Component } from "react";
import { View, Button } from "react-native";

export default class MenuLeftRigth extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button
          title="Left !"
          onPress={() => this.props.navigation.navigate("Test", { eye: "left" })}
        />
        <Button
          title="Right !"
          onPress={() => this.props.navigation.navigate("Test", { eye: "right" })}
        />
      </View>
    );
  }
}
