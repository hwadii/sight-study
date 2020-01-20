import React from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  Dimensions,
  ActivityIndicator
} from "react-native";
import { defaultEtdrsScale, setAcuites, getAcuites } from "./util";
import { styles as common, colors } from "./styles/common";
import { scale } from "react-native-size-matters";

export default class Etdrs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      acuites: {}
    };
    this.handleChangeField = this.handleChangeField.bind(this);
    this.handleChangeAcuite = this.handleChangeAcuite.bind(this);
    this.handleSetAcuites = this.handleSetAcuites.bind(this);
    this.reinitAcuites = this.reinitAcuites.bind(this);
  }

  async componentDidMount() {
    this.setState({
      acuites: await getAcuites()
    });
  }

  handleChangeField(e, field) {
    this.setState({ [field]: e.nativeEvent.text });
  }

  async handleSetAcuites() {
    const { acuites } = this.state;
    const { goBack } = this.props.navigation;
    await setAcuites(acuites);
    goBack();
  }

  handleChangeAcuite(e, i) {
    let { acuites } = this.state;
    acuites[i] = e.nativeEvent.text;
    this.setState({ acuites });
  }

  reinitAcuites() {
    this.setState({
      acuites: defaultEtdrsScale
    });
  }

  render() {
    const { acuites } = this.state;
    return (
      <View>
        <Text style={styles.header}>
          Valeurs des acuités visuelles à tester
        </Text>
        <Form
          acuites={acuites}
          reinitAcuites={this.reinitAcuites}
          handleSetAcuites={this.handleSetAcuites}
          handleChangeAcuite={this.handleChangeAcuite}
        />
      </View>
    );
  }
}

function Form({
  acuites,
  reinitAcuites,
  handleSetAcuites,
  handleChangeAcuite
}) {
  const acuitesEntries = Object.entries(acuites);
  return (
    <View style={styles.form}>
      <View style={styles.board}>
        <View
          style={{
            flex: 1,
            alignSelf: "stretch",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Text style={styles.label}>Échelle EDTRS St-Joseph</Text>
        </View>
        <View style={{ flex: 1, alignSelf: "stretch" }}>
          <Text style={styles.label}>Acuité Visuelle (décimale)</Text>
        </View>
      </View>
      {acuitesEntries.map(([etdrs, acuite]) => (
        <Field
          key={etdrs}
          value={acuite.toString()}
          label={etdrs}
          handler={e => handleChangeAcuite(e, etdrs)}
        />
      ))}
      <ActivityIndicator
        size="large"
        color="#0000ff"
        animating={acuitesEntries.length === 0}
      />
      <View style={{ justifyContent: "center", flexDirection: "row" }}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => handleSetAcuites()}
        >
          <Text style={styles.confirmButtonText}>CONFIRMER</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.reinitButton}
          onPress={() => reinitAcuites()}
        >
          <Text style={styles.confirmButtonText}>RÉINITIALISER 🔄</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Field({ value, label, handler }) {
  return (
    <View style={styles.board}>
      <View
        style={{
          flex: 1,
          alignSelf: "stretch",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={{ flex: 1, alignSelf: "stretch" }}>
        <TextInput
          defaultValue={value}
          style={common.inputs}
          autoCorrect={false}
          defaultValue={value}
          keyboardType="number-pad"
          textContentType="none"
          onChange={handler}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { width: scale(320), maxWidth: Dimensions.get("window").width },
  board: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    alignItems: "center"
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    margin: 10
  },
  confirmButton: {
    borderWidth: 1,
    borderColor: colors.PRIMARY,
    backgroundColor: colors.PRIMARY,
    padding: 10,
    marginHorizontal: 8,
    width: 300,
    maxWidth: 400
  },
  reinitButton: {
    borderWidth: 1,
    borderColor: colors.SECONDARY,
    backgroundColor: colors.SECONDARY,
    padding: 10,
    marginHorizontal: 8,
    width: 200,
    maxWidth: 400
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center"
  },
  label: {
    fontSize: 25,
    marginTop: 3,
    justifyContent: "center",
    alignItems: "center"
  }
});