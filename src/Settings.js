import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity
} from "react-native";
import { scale } from "react-native-size-matters";
import { styles as common } from "./styles/common";
import { setDistance, setDecalage } from "./util";

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      distance: "",
      decalage: ""
    };
    this.handleChangeField = this.handleChangeField.bind(this);
    this.handleModifDistance = this.handleModifDistance.bind(this);
    this.props.navigation.navigate = this.props.navigation.navigate.bind(this);
  }

  handleChangeField(e, field) {
    this.setState({ [field]: e.nativeEvent.text });
  }

  async handleModifDistance() {
    const { navigate } = this.props.navigation;
    const { distance, decalage } = this.state;
    await setDistance(distance);
    await setDecalage(decalage);
    navigate("SetUser");
  }

  render() {
    return (
      <View style={styles.container}>
        <Form
          navigate={this.props.navigation.navigate}
          handleChange={this.handleChangeField}
          handleModifDistance={this.handleModifDistance}
        />
      </View>
    );
  }
}

function Form({ handleChange, handleModifDistance }) {
  return (
    <View style={styles.form}>
      <Field label="Distance" handler={e => handleChange(e, "distance")} />
      <Field label="Decalage" handler={e => handleChange(e, "decalage")} />
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => handleModifDistance()}
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
