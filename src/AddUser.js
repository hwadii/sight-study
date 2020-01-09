import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  DatePickerIOS,
  Picker
} from "react-native";
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
      date: new Date(),
      sex: "homme"
    };
    this.setDate = this.setDate.bind(this);
    this.setSex = this.setSex.bind(this);
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
    console.log(this.state)
    /*User.addUser(nom, prenom, 0, () => {
      navigate("SetUser");
    });*/
  }

  setDate(newDate) {
    this.setState({ date: newDate });
  }

  setSex(newSex) {
    this.setState({ sex: newSex });

  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Nouveau patient</Text>
        <Form
          navigate={this.props.navigation.navigate}
          handleChange={this.handleChangeField}
          handleAddUser={this.handleAddUser}
          setDate={this.setDate}
          setSex={this.setSex}
          state= {this.state}
        />
      </View>
    );
  }
}

function Form({ handleChange, handleAddUser, setDate, setSex, state }) {
  return (
    <View style={styles.form}>
      <Field label="Prénom" handler={e => handleChange(e, "prenom")} />
      <Field label="Nom" handler={e => handleChange(e, "nom")} />
      <DateN label="Date de naissance" handler={e => setDate(e)} state={state} />
      <RadioButton label="Sex" handler={e => setSex(e)} state={state}/>
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

function RadioButton({ label, handler,state }) {
  return (
    <>
      <Text style={common.inputsLabels}>{label}</Text>
      <Picker selectedValue = {state.sex} onValueChange={handler}>
      
        <Picker.Item label="Homme" value="homme" />
        <Picker.Item label="Femme" value="femme" />
      </Picker>
    </>
  );
}

function DateN({ label, handler, state }) {
  return (
    <>
      <Text style={common.inputsLabels}>{label}</Text>
      <DatePickerIOS date={state.date} onDateChange={handler} mode="date" />
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
