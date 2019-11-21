import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { scale } from "react-native-size-matters";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import * as User from "../service/db/User";

export default class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prenom: "",
      nom: "",
      pin: ""
    };
    this.handleChangeField = this.handleChangeField.bind(this);
    this.handleAddUser = this.handleAddUser.bind(this);
    this.props.navigation.navigate = this.props.navigation.navigate.bind(this);
  }

  componentDidMount() {
    User.initDB();
  }

  handleChangeField(e, field) {
    this.setState({ [field]: e.nativeEvent.text });
  }

  handleAddUser() {
    const { navigate } = this.props.navigation;
    const { nom, prenom } = this.state;
    User.addUser(nom, prenom, "1234", 0, () => {
      navigate("SignIn");
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Nouvel utilisateur</Text>
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
      <Text style={styles.inputsLabels}>{label}</Text>
      <TextInput
        style={styles.inputs}
        maxLength={20}
        autoCorrect={false}
        placeholder={`Entrez votre ${label.toLowerCase()}`}
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
