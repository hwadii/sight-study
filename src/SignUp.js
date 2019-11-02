import React from "react";
import { StyleSheet, Text, View, Button, Dimensions } from "react-native";
import { scale } from "react-native-size-matters";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { Platform } from "@unimodules/core";

export default class SignIn extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Nouvel utilisateur</Text>
        <Form navigate={this.props.navigation.navigate} />
      </View>
    );
  }
}

function Form(props) {
  return (
    <View style={styles.form}>
      <Text style={styles.inputsLabels}>Prénom</Text>
      <TextInput
        style={styles.inputs}
        maxLength={20}
        autoCorrect={false}
        placeholder="Entrez votre prénom"
      />
      <Text style={styles.inputsLabels}>Nom</Text>
      <TextInput
        style={styles.inputs}
        maxLength={20}
        autoCorrect={false}
        placeholder="Entrez votre nom"
      />
      {Platform.OS === "web" ? (
        <Button
          title="CONFIRMER"
          onPress={() =>
            props.navigate("SignUp", {
              firstName: "Wadii",
              lastName: "Hajji"
            })
          }
        />
      ) : (
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() =>
            props.navigate("SignUp", {
              firstName: "Wadii",
              lastName: "Hajji"
            })
          }
        >
          <Text style={styles.confirmButtonText}>CONFIRMER</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 15
  },
  form: {
    width: scale(320),
    maxWidth: Dimensions.get("window").width
  },
  inputs: {
    borderTopWidth: 1,
    borderColor: "#CCCCCC",
    borderBottomWidth: 1,
    height: 50,
    fontSize: 25,
    paddingLeft: 5,
    paddingRight: 5,
    marginBottom: 6
  },
  inputsLabels: {
    fontSize: 18,
    marginTop: 7
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    margin: 10
  },
  confirmButton: {
    borderWidth: 1,
    borderColor: "#007BFF",
    backgroundColor: "#007BFF",
    padding: 15,
    marginTop: 7
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center"
  }
});
