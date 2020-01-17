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
import {
  TextInput,
  TouchableOpacity,
  ScrollView
} from "react-native-gesture-handler";
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
      distance: "",
      sex: "H"
    };
    this.handleChangeField = this.handleChangeField.bind(this);
    this.showDatePickerAndSet = this.showDatePickerAndSet.bind(this);
  }

  componentWillUnmount() {
    this.setState({ prenom: "", nom: "", date: "", distance: null });
  }

  handleChangeField(e, field) {
    this.setState({ [field]: e });
  }

  handleDistanceTest() {
    const { navigate } = this.props.navigation;
    navigate("DistanceFinder");
  }

  async handleAddUser() {
    const { goBack } = this.props.navigation;
    const { nom, prenom, sex, date, distance } = this.state;
    await User.addUser(nom, prenom, sex, date.toISOString(), distance);
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
    const { prenom, nom, sex, date, distance } = this.state;
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Nouveau patient</Text>
        <Form
          userInfo={{ prenom, nom, date, sex, distance }}
          handleChange={this.handleChangeField}
          showDatePickerAndSet={this.showDatePickerAndSet}
        />
        <TouchableOpacity
          style={{ ...styles.form, ...styles.confirmButton }}
          onPress={() => this.handleDistanceTest()}
        >
          <Text style={styles.confirmButtonText}>TEST DE DISTANCE »</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.form, ...styles.confirmButton }}
          onPress={() => this.handleAddUser()}
        >
          <Text style={styles.confirmButtonText}>CONFIRMER</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

// TODO: Put this in frequently used components

function Form({ handleChange, userInfo, showDatePickerAndSet }) {
  const { prenom, nom, sex, date, distance } = userInfo;
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
      <Field
        value={distance}
        label="Distance"
        handleOnChange={e => handleChange(e, "distance")}
      />
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

function Field({ label, value, type, handleOnChange }) {
  return (
    <>
      <Text style={common.inputsLabels}>{label}</Text>
      <TextInput
        value={typeof value === "object" ? formatDate(value) : value}
        keyboardType={type === "numeric" ? "numeric" : "default"}
        style={common.inputs}
        maxLength={20}
        autoCorrect={false}
        placeholder={label}
        onChangeText={handleOnChange}
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
