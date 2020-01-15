import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  DatePickerAndroid,
  Picker,
  TouchableHighlight
} from "react-native";
import { scale } from "react-native-size-matters";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import * as User from "../service/db/User";
import { styles as common } from "./styles/common";
import { formatDate } from "./util";

export default class AddUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prenom: "",
      nom: "",
      date: "",
      sex: "H"
    };
    this.handleChangeField = this.handleChangeField.bind(this);
    this.showDatePickerAndSet = this.showDatePickerAndSet.bind(this);
  }

  componentWillUnmount() {
    this.setState({ prenom: "", nom: "", date: "" });
  }

  handleChangeField(e, field) {
    this.setState({ [field]: e });
  }

  async handleAddUser() {
    const { goBack } = this.props.navigation;
    const { nom, prenom, sex, date } = this.state;
    await User.addUser(nom, prenom, sex, date.toISOString());
    goBack();
  }

  async showDatePickerAndSet() {
    const { date } = this.state;
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: date || new Date(1981, 1, 1)
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        this.handleChangeField(new Date(year, month, day), "date");
      }
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message);
    }
  }

  render() {
    const { prenom, nom, sex, date } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Nouveau patient</Text>
        <Form
          userInfo={{ prenom, nom, date, sex }}
          handleChange={this.handleChangeField}
          showDatePickerAndSet={this.showDatePickerAndSet}
        />
        <TouchableOpacity
          style={{ ...styles.form, ...styles.confirmButton }}
          onPress={() => this.handleAddUser()}
        >
          <Text style={styles.confirmButtonText}>CONFIRMER</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

// TODO: Put this in frequently used components

function Form({ handleChange, userInfo, showDatePickerAndSet }) {
  const { prenom, nom, sex, date } = userInfo;
  return (
    <View style={styles.form}>
      <Field
        value={prenom}
        label="Prénom"
        handleOnChange={e => handleChange(e, "prenom")}
      />
      <Field
        value={nom}
        label="Nom"
        handleOnChange={e => handleChange(e, "nom")}
      />
      <Text style={common.inputsLabels}>Date de naissance</Text>
      <TouchableHighlight
        underlayColor="#fff"
        onPress={() => showDatePickerAndSet()}
      >
        <Text style={common.inputViews}>{date && formatDate(date)}</Text>
      </TouchableHighlight>
      <Select
        label="Sexe"
        value={sex}
        handleOnChange={e => handleChange(e, "sex")}
      >
        <Picker.Item label="Homme" value="H" />
        <Picker.Item label="Femme" value="F" />
      </Select>
    </View>
  );
}

// HACK: si onFocus => on attend une date donc on veut une value dans le champ
function Field({ label, value, handleOnChange, handleOnFocus }) {
  return (
    <>
      <Text style={common.inputsLabels}>{label}</Text>
      <TextInput
        value={typeof value === "object" ? value.toLocaleDateString() : value}
        style={common.inputs}
        maxLength={20}
        autoCorrect={false}
        placeholder={label}
        onChangeText={handleOnChange}
        onFocus={handleOnFocus}
      />
    </>
  );
}

function Select({ label, handleOnChange, value, children }) {
  return (
    <>
      <Text style={common.inputsLabels}>{label}</Text>
      <View style={common.inputs}>
        <Picker selectedValue={value} onValueChange={handleOnChange}>
          {children}
        </Picker>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingBottom: 15
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
