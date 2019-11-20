import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

// TODO: create common styles

export default class Selection extends React.Component {
  handleUser(type) {
    this.props.navigation.navigate("SignUp", {
      type
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Qui êtes-vous ?</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.handleUser("patient")}
        >
          <Text style={styles.buttonText}>Patient</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.handleUser("personnel")}
        >
          <Text style={styles.buttonText}>Personnel médical</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    // height: "100%",
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5
  },
  header: {
    fontSize: 22,
    paddingVertical: 5,
    fontWeight: "bold",
    textAlign: "center"
  },
  button: {
    borderWidth: 1,
    width: "100%",
    borderColor: "#007BFF",
    backgroundColor: "#007BFF",
    padding: 15,
    marginTop: 7,
    borderRadius: 5
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center",
  }
});
