import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Slider,
  TouchableOpacity
} from "react-native";
import {
  setDoctorEmail,
  setBrightness,
  setAdminPin,
  setVolume,
  getAllSettings
} from "./util";
import { styles as common } from "./styles/common";
import SystemSetting from "react-native-system-setting";
import * as Speech from "expo-speech";

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pin: "",
      mail: "",
      volume: null,
      brightness: null
    };
    this.handleChangeField = this.handleChangeField.bind(this);
    this.props.navigation.navigate = this.props.navigation.navigate.bind(this);
  }

  handleChangeField(e, field) {
    this.setState({ [field]: e });
  }

  async componentDidMount() {
    const currentVolume = await SystemSetting.getVolume();
    const currentBrightness = await SystemSetting.getAppBrightness();
    const { volume, brightness, mail, pin } = await getAllSettings();
    this.setState({
      pin,
      mail,
      volume: volume || currentVolume,
      brightness: brightness || currentBrightness
    });
  }

  changeBrightness(value) {
    SystemSetting.setAppBrightness(value);
    this.setState({
      brightness: value
    });
  }

  changeSound(value) {
    SystemSetting.setVolume(value);
    this.setState({
      volume: value
    });
  }

  speak(sentence) {
    Speech.speak(sentence, {
      language: "fr"
    });
  }

  stop(sentence) {
    Speech.stop();
    this.speak(sentence);
  }

  toggleSpeak(sentence) {
    Speech.isSpeakingAsync()
      .then(isSpeaking =>
        isSpeaking ? this.stop(sentence) : this.speak(sentence)
      )
      .catch(console.error);
  }

  volumeRelease() {
    this.toggleSpeak("Ceci est un essai du volume sonore");
  }

  async handleOnOk() {
    const { mail, volume, brightness, pin } = this.state;
    const { goBack } = this.props.navigation;
    await Promise.all([
      setDoctorEmail(mail),
      setVolume(volume.toString()),
      setBrightness(brightness.toString()),
      setAdminPin(pin)
    ]);
    goBack();
  }

  render() {
    const { volume, brightness, pin, mail } = this.state;
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.header}>Paramètres généraux</Text>
          <Text style={common.inputsLabels}>Luminosité</Text>
          <Slider
            step={0.1}
            maximumValue={1}
            onValueChange={this.changeBrightness.bind(this)}
            value={brightness}
          />
          <Text style={common.inputsLabels}>Volume</Text>
          <Slider
            step={0.1}
            maximumValue={1}
            onValueChange={this.changeSound.bind(this)}
            onSlidingComplete={this.volumeRelease.bind(this)}
            value={volume}
          />
          <Field
            label="PIN"
            maxLength={4}
            value={pin}
            type="numeric"
            handleOnChange={e => this.handleChangeField(e, "pin")}
          />
          <Field
            label="Email du médecin"
            value={mail}
            handleOnChange={e => this.handleChangeField(e, "mail")}
          />
        </View>
        <View>
          <TouchableOpacity
            style={{ ...styles.form, ...common.actionButtons }}
            onPress={() => this.handleOnOk()}
          >
            <Text style={common.actionButtonsText}>CONFIRMER ✅</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

function Field({ label, value, type, handleOnChange, maxLength = 20 }) {
  return (
    <>
      <Text style={common.inputsLabels}>{label}</Text>
      <TextInput
        value={value}
        keyboardType={type === "numeric" ? "numeric" : "default"}
        style={common.inputs}
        maxLength={maxLength}
        autoCorrect={false}
        placeholder={label}
        onChangeText={handleOnChange}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 15,
    justifyContent: "space-between"
  },
  form: {},
  header: {
    fontSize: 30,
    fontWeight: "bold",
    margin: 10,
    textAlign: "center"
  },
  label: {
    fontSize: 25,
    marginTop: 3,
    justifyContent: "center",
    alignItems: "center"
  }
});
