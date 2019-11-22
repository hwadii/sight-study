import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles as commonStyles } from "./styles/common";
import { setUserType } from "./util/util";

export default class Selection extends React.Component {
  handleUser(type) {
    setUserType(type, () => {
      this.props.navigation.navigate("SignIn");
    });
  }

  render() {
    return (
      <View style={commonStyles.containers}>
        <Text style={commonStyles.headers}>Qui êtes-vous ?</Text>
        <TouchableOpacity
          style={commonStyles.actionButtons}
          onPress={() => this.handleUser("patient")}
        >
          <Text style={commonStyles.actionButtonsText}>Patient</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={commonStyles.actionButtons}
          onPress={() => this.handleUser("personnel")}
        >
          <Text style={commonStyles.actionButtonsText}>Personnel médical</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
