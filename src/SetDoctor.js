import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { scale } from "react-native-size-matters";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { styles as common } from "./styles/common";
<<<<<<< HEAD
import { setDoctorEmail } from "./util";
=======
import { setDoctorEmail, getDoctorEmail } from "./util";
>>>>>>> origin/master

// IMPORTANT: remove this garbage and merge with addUser

export default class SetDoctor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mail: ""
    };
    this.handleChangeField = this.handleChangeField.bind(this);
    this.handleModifMedecin = this.handleModifMedecin.bind(this);
    this.props.navigation.navigate = this.props.navigation.navigate.bind(this);
  }

<<<<<<< HEAD
=======
  async componentDidMount() {
    this.setState({ mail: await getDoctorEmail() });
  }

>>>>>>> origin/master
  handleChangeField(e, field) {
    this.setState({ [field]: e.nativeEvent.text });
  }

  async handleModifMedecin() {
    const { navigate } = this.props.navigation;
    const { mail } = this.state;
    await setDoctorEmail(mail);
    navigate("SetUser");
  }

  render() {
<<<<<<< HEAD
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Modification Mail Medecin</Text>
        <Form
          navigate={this.props.navigation.navigate}
          handleChange={this.handleChangeField}
          handleModifMedecin={this.handleModifMedecin}
        />
=======
    const { mail } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Modification Mail Medecin</Text>
        <View style={styles.form}>
          <Field
            value={mail}
            label="Mail"
            handler={e => this.handleChangeField(e, "mail")}
          />
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => this.handleModifMedecin()}
          >
            <Text style={styles.confirmButtonText}>CONFIRMER</Text>
          </TouchableOpacity>
        </View>
>>>>>>> origin/master
      </View>
    );
  }
}

<<<<<<< HEAD
function Form({ handleChange, handleModifMedecin }) {
  return (
    <View style={styles.form}>
      <Field label="Mail" handler={e => handleChange(e, "mail")} />
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => handleModifMedecin()}
      >
        <Text style={styles.confirmButtonText}>CONFIRMER</Text>
      </TouchableOpacity>
    </View>
  );
}

function Field({ label, handler }) {
=======
function Field({ value, label, handler }) {
>>>>>>> origin/master
  return (
    <>
      <Text style={common.inputsLabels}>{label}</Text>
      <TextInput
        style={common.inputs}
<<<<<<< HEAD
=======
        defaultValue={value}
>>>>>>> origin/master
        autoCorrect={false}
        placeholder={`Entrez le ${label.toLowerCase()}`}
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
