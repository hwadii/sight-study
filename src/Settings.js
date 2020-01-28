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
  getAllSettings,
  setTargetLines,
  setQrSize,
  showAlert
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
      targetLines: null,
      qrSize: "",
      volume: null,
      brightness: null
    };
    this.handleChangeField = this.handleChangeField.bind(this);
    this.props.navigation.navigate = this.props.navigation.navigate.bind(this);
  }

  // Sauvegarde d'un parametre
  handleChangeField(e, field) {
    this.setState({ [field]: e });
  }

  async componentDidMount() {

    // Chargement des parametres sauvegardes
    const currentVolume = await SystemSetting.getVolume();
    const currentBrightness = await SystemSetting.getAppBrightness();
    const {
      volume,
      brightness,
      mail,
      pin,
      targetLines,
      qrsize
    } = await getAllSettings();
    this.setState({
      pin,
      mail,
      targetLines: targetLines ? targetLines.toString() : "",
      volume: volume || currentVolume,
      brightness: brightness || currentBrightness,
      qrSize: qrsize ? qrsize.toString() : ""
    });
  
  }

  // Sauvegarde de la luminosite et son application
  changeBrightness(value) {
    SystemSetting.setAppBrightness(value);
    this.setState({
      brightness: value
    });
  }

  // Sauvegarde du volume et son application
  changeSound(value) {
    SystemSetting.setVolume(value);
    this.setState({
      volume: value
    });
  }

  // Synthese vocale
  speak(sentence) {
    Speech.speak(sentence, {
      language: "fr"
    });
  }

  // Stoppe la synthese vocale et la redemarre
  stop(sentence) {
    Speech.stop();
    this.speak(sentence);
  }

  // Declenche la synthese vocale
  toggleSpeak(sentence) {
    Speech.isSpeakingAsync()
      .then(isSpeaking =>
        isSpeaking ? this.stop(sentence) : this.speak(sentence)
      )
      .catch(console.error);
  }

  // Lorsqu'on lache le slider du volume une voix de test est lancee
  volumeRelease() {
    this.toggleSpeak("Ceci est un essai du volume sonore");
  }

  // Verifie les champs
  // le mail doit inclure "@"
  // le code PIN, s'il est remplit, doit contenir 4 caracteres
  // le nombre de lignes du test ne doit pas etre 0
  // la taille du QR Code doit etre un float
  verifyField() {
    const { mail, pin, targetLines, qrSize } = this.state;
    const show = str => showAlert(str, null, [], "Erreur de saisie");
    if (mail && !mail.includes("@")) {
      show("Veuillez renseigner une adresse valide");
      return false;
    }
    if (pin && pin.length !== 4) {
      show("Le code PIN doit contenir 4 caractères");
      return false;
    }
    if (targetLines && targetLines.length === 0) {
      show("Veuillez renseigner le nombre de lignes du test");
      return false;
    }
    if (parseFloat(qrSize) != qrSize) {
      show("La taille du QR code doit être en décimal");
      return false;
    }
    return true;
  }

  // Si les champs on ete verifies, les parametres sont appliques
  async handleOnOk() {
    const { mail, volume, brightness, pin, targetLines, qrSize } = this.state;
    const { goBack } = this.props.navigation;

    if (this.verifyField()) {
      goBack();
      await Promise.all([
        setDoctorEmail(mail),
        setVolume(volume.toString()),
        setBrightness(brightness.toString()),
        setAdminPin(pin),
        setTargetLines(targetLines),
        setQrSize(qrSize)
      ]);
    }
  }

  render() {
    const { volume, brightness, pin, mail, targetLines, qrSize } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Paramètres généraux</Text>

        {/* Parametre : luminosite (slider) */}
        <Text style={common.inputsLabels}>Luminosité</Text>
        <Slider
          step={0.1}
          maximumValue={1}
          onValueChange={this.changeBrightness.bind(this)}
          value={brightness}
        />

        {/* Parametre : volume sonore (slider) */}
        <Text style={common.inputsLabels}>Volume</Text>
        <Slider
          step={0.1}
          maximumValue={1}
          onValueChange={this.changeSound.bind(this)}
          onSlidingComplete={this.volumeRelease.bind(this)}
          value={volume}
        />

        {/* Parametre : code PIN */}
        <Field
          label="PIN"
          maxLength={4}
          value={pin}
          type="numeric"
          handleOnChange={e => this.handleChangeField(e, "pin")}
        />

        {/* Parametre : email du medecin */}
        <Field
          label="Email du médecin"
          value={mail}
          handleOnChange={e => this.handleChangeField(e, "mail")}
        />

        {/* Parametre : nombre de lignes du test */}
        <Field
          label="Nombre de lignes du test"
          value={targetLines}
          maxLength={2}
          type="numeric"
          handleOnChange={e => this.handleChangeField(e, "targetLines")}
        />

        {/* Parametre : taille du QR code */}
        <Field
          label="Taille du QR code (en cm)"
          value={qrSize}
          maxLength={4}
          handleOnChange={e => this.handleChangeField(e, "qrSize")}
        />
        <TouchableOpacity
          style={common.actionButtons}
          onPress={() => this.handleOnOk()}
        >
          <Text style={common.actionButtonsText}>CONFIRMER ✅</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

// Champ pour chaque parametre
// label : nom du parametre
// value : valeur actuellement sauvegarde
// type : numerique ou par defaut
// handleOnChange : fonction appelee lors de validation
// maxLength : taille maximale du champs
function Field({ label, value, type, handleOnChange, maxLength = 50 }) {
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
    margin: 15
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
