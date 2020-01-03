import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles as common } from "./styles/common";

export default class Selection extends React.Component {
  handleAction(action) {
    switch (action) {
      case "REGLAGES":
        this.props.navigation.navigate("SetUser");
        break;
      case "TEST":
        this.props.navigation.navigate("Menu");
        break;
      default:
        break
    }
  }

  render() {
    return (
      <View style={common.containers}>
        <Text style={common.headers}>Menu principal</Text>
        <TouchableOpacity
          style={common.actionButtons}
          onPress={() => this.handleAction("TEST")}
        >
          <Text style={common.actionButtonsText}>Aller au test</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={common.actionButtons}
          onPress={() => this.handleAction("REGLAGES")}
        >
          <Text style={common.actionButtonsText}>Réglages</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
