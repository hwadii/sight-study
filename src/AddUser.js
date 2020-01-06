import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { scale } from "react-native-size-matters";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import * as User from "../service/db/User";
import { styles as common } from "./styles/common";

export default class AddUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prenom: "",
      nom: "",
    };
    this.handleChangeField = this.handleChangeField.bind(this);
    this.handleAddUser = this.handleAddUser.bind(this);
    this.props.navigation.navigate = this.props.navigation.navigate.bind(this);
  }

  // FIXME: utile ?
  componentDidMount() {
    User.initDB();
  }

  handleChangeField(e, field) {
    this.setState({ [field]: e.nativeEvent.text });
  }

  handleAddUser() {
    const { navigate } = this.props.navigation;
    const { nom, prenom } = this.state;
    User.addUser(nom, prenom, 0, () => {
      navigate("SetUser");
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Nouveau patient</Text>
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
      <Field label="Prénom" handler={e => handleChange(e, "prenom")} />
      <Field label="Nom" handler={e => handleChange(e, "nom")} />
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
