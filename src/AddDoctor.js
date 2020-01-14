import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { scale } from "react-native-size-matters";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import * as User from "../service/db/User";
import { setDoctorEmail, getDoctorEmail } from "./util/util"
import { styles as common } from "./styles/common";

// TODO: Set doctor function in async storage

export default class AddDoctor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ""
    };
    this.handleChangeField = this.handleChangeField.bind(this);
    this.handleAddUser = this.handleAddUser.bind(this);
    this.props.navigation.navigate = this.props.navigation.navigate.bind(this);
  }

  handleChangeField(e, field) {
    this.setState({ [field]: e.nativeEvent.text });
  }

  async handleAddUser() {
    const { navigate } = this.props.navigation;
    const { email } = this.state;
    await setDoctorEmail(email);
    navigate("SetUser");
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Nouveau médecin</Text>
        <Form
          navigate={this.props.navigation.navigate}
          handleChange={this.handleChangeField}
          handleAddUser={this.handleAddUser}
        />
      </View>
    );
  }
}

function Form({ handleChange, handleAddUser }) {
  return (
    <View style={styles.form}>
      <Field label="Email" handler={e => handleChange(e, "email")} />
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => handleAddUser()}
      >
        <Text style={styles.confirmButtonText}>CONFIRMER</Text>
      </TouchableOpacity>
    </View>
  );
}

function Field({ label, handler }) {
  return (
    <>
      <Text style={common.inputsLabels}>{label}</Text>
      <TextInput
        style={common.inputs}
        maxLength={20}
        autoCorrect={false}
        placeholder={`Entrez son ${label.toLowerCase()}`}
        onChange={handler}
      />
    </>
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
