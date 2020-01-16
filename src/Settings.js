import React from "react";
import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity } from "react-native";
import { scale } from "react-native-size-matters";
import { styles as common } from "./styles/common";

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      distance: null, 
      tolerance: null
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
    const { distance, tolerance } = this.state;
    await setDistance(distance);
    await setTolerance(tolerance);
    navigate("SetUser");
  }

  render() {
    const {distance, tolerance} = this.state;
    return (
      <View style={styles.container}>
        <Form
          values={[distance, tolerance]}
          navigate={this.props.navigation.navigate}
          handleChange={this.handleChangeField}
          handleModifDistance={this.handleModifDistance}
        />
      </View>
    );
  }
}

function Form({ values, handleChange, handleModifDistance }) {
  const [distance, tolerance] = values;
  return (
    <View style={styles.form}>
      <Field value={distance} label="Distance" handler={e => handleChange(e, "distance")} />
      <Field value={tolerance} label="Tolérance" handler={e => handleChange(e, "tolerance")} />
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => handleModifDistance()}
      >
        <Text style={styles.confirmButtonText}>CONFIRMER</Text>
      </TouchableOpacity>
    </View>
  );
}

function Field({ value, label, handler }) {
  return (
    <>
      <Text style={common.inputsLabels}>{label}</Text>
      <TextInput
        defaultValue={value}
        style={common.inputs}
        autoCorrect={false}
        placeholder={label}
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
