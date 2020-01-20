import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Slider,
  Button 
} from "react-native";
import { scale } from "react-native-size-matters";
import { setAcuites, getAcuites, defaultEtdrsScale } from "./util";
import { colors } from "./styles/common";
import { ScrollView } from "react-native-gesture-handler";
import SystemSetting from "react-native-system-setting";
import * as Speech from "expo-speech";

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      acuites: {},
      brightnessvalue: 0,
      volumevalue: 0
    };
    this.handleChangeField = this.handleChangeField.bind(this);
    this.handleChangeAcuite = this.handleChangeAcuite.bind(this);
    this.handleSetAcuites = this.handleSetAcuites.bind(this);
    this.props.navigation.navigate = this.props.navigation.navigate.bind(this);
    this.reinitAcuites = this.reinitAcuites.bind(this);
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

  async componentDidMount() {
    SystemSetting.getVolume().then((volume)=>{
      this.setState({volumevalue: volume});
    });
    SystemSetting.getAppBrightness().then((brightness)=>{
      this.setState({brightnessvalue: brightness});
    })    
    this.setState({
      acuites: await getAcuites()
    })
  }

  changeBrightness(value) {
    SystemSetting.setAppBrightness(value)
    
    clearTimeout(this.sliderTimeoutId)
    this.sliderTimeoutId = setTimeout(() => {
      this.setState(() => {
        return {
          brightnessvalue: value,
        };
      });
    }, 100)

  }

  changeSound(value) {
    SystemSetting.setVolume(value)
    
    clearTimeout(this.sliderTimeoutId)
    this.sliderTimeoutId = setTimeout(() => {
      this.setState(() => {
        return {
          volumevalue: parseFloat(value),
        };
      });
    }, 100)
  }

  speak(sentence) {
    Speech.speak(sentence, {
      language: "fr"
    });
  }

  stop(sentence) {
    Speech.stop();
    this.speak(sentence)
  }

  toggleSpeak(sentence) {
    Speech.isSpeakingAsync()
      .then(isSpeaking => (isSpeaking ? this.stop(sentence) : this.speak(sentence)))
      .catch(console.error);
  }

  volumeRelease(value) {
    this.toggleSpeak("ceci est un essai du volume sonore")
  }  

  reinitAcuites() {
    this.setState({
      acuites: defaultEtdrsScale
    });
  }

  render() {
    const { acuites, brightnessvalue } = this.state;
    return (
      <ScrollView
        contentContainerStyle={styles.container}
      >
        <View style={styles.form}>
        <Text style={styles.label}>{"Régler la luminosité"}</Text>
        <Slider
          step={0.01}
          maximumValue={1}
          onValueChange={this.changeBrightness.bind(this)}
          value={brightnessvalue}
        />
        <Text style={styles.label}>{"Régler le volume"}</Text>
        <Slider
          step={0.01}
          maximumValue={1}
          onValueChange={this.changeSound.bind(this)}
          onSlidingComplete={this.volumeRelease.bind(this)}
          value={this.state.volumevalue}
        />
        </View>
        <Text style={styles.header}>
          Valeurs des acuités visuelles à tester
        </Text>
        <Form
          acuites={acuites}
          reinitAcuites={this.reinitAcuites}
          handleSetAcuites={this.handleSetAcuites}
          handleChangeAcuite={this.handleChangeAcuite}
        />
      </ScrollView>
    );
  }
}

// TODO: Implement Keyboard not covering inputs
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
          <Text style={styles.label}>Acuité Visuel (décimal)</Text>
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
          style={styles.inputs}
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
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 15
  },
  form: { width: scale(320),
    maxWidth: Dimensions.get("window").width
  },
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
  noAccount: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    textAlignVertical: "center"
  },
  inputs: {
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 3,
    fontSize: 25,
    height: 50,
    paddingLeft: 5,
    paddingRight: 5,
    marginBottom: 6,
    width: 200
  },
  label: {
    fontSize: 25,
    marginTop: 3,
    justifyContent: "center",
    alignItems: "center"
  },
  texte: {
    fontSize: 16
  }
});
