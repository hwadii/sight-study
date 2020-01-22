import React from "react";
import * as Speech from "expo-speech";
import { View, Button } from "react-native";
import { withNavigation } from "react-navigation";
import { colors } from "./styles/common";
import DialogInput from 'react-native-dialog-input';
import { getAdminPin, showAlert } from "./util"

const sentences = {
  MainMenu: "Bienvenue sur l'application Sight Study",
  Menu:
    "Vous êtes sur votre compte. Pour commencer le test appuyez sur l'icône de gauche. Pour consulter vos résultats, appuyez sur l'icône de droite."
};

// TODO: Add une option mute all
class Help extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSpeakingText: "Aide 📢",
      isSpeakingButton: colors.DANGER,
      isDialogVisible: false,
      pin: ""
    };
  }

  speak() {
    const { routeName } = this.props.navigation.state;
    Speech.speak(sentences[routeName], {
      language: "fr",
      onStart: () =>
        this.setState({
          isSpeakingText: "Stop 🔇",
          isSpeakingButton: colors.DANGER
        }),
      onDone: () =>
        this.setState({
          isSpeakingText: "Aide 📢",
          isSpeakingButton: colors.SUCESS
        }),
      onStopped: () =>
        this.setState({
          isSpeakingText: "Aide 📢",
          isSpeakingButton: colors.SUCESS
        })
    });
  }

  stop() {
    Speech.stop();
  }

  toggleSpeak() {
    Speech.isSpeakingAsync().then(isSpeaking =>
      isSpeaking ? this.stop() : this.speak()
    ).catch(console.error);
  }

  async componentDidMount() {
    this.didFocusSub = this.props.navigation.addListener("didFocus", () => {
      this.speak();
    });
    this.willBlurSub = this.props.navigation.addListener("willBlur", () => {
      this.stop();
    });
    this.setState({
      pin: await getAdminPin()
    })
  }

  componentWillUnmount() {
    this.didFocusSub.remove();
    this.willBlurSub.remove();
  }

  goToSettings(value) {
    if ( value == this.state.pin ){
      this.hideDialog()
      this.props.navigation.navigate("SetUser");
    }
    else{
      this.hideDialog()
      showAlert("Mauvais code PIN")
    }
  }

  openDialog() {
    this.setState({isDialogVisible: true});
  }

  hideDialog(){
    this.setState({isDialogVisible: false});
  }

  render() {
    const { isSpeakingText, isSpeakingButton } = this.state;
    return (
      <View style={{ marginHorizontal: 10 }}>
        <DialogInput isDialogVisible={this.state.isDialogVisible}
          title={"Accès aux réglages"}
          message={"Entrer le code PIN"}
          hintInput ={"####"}
          submitInput={ (inputText) => {this.goToSettings(inputText)} }
          closeDialog={ () => {this.hideDialog()}}>
        </DialogInput>
        <Button
          color="red"
          onPress={() => this.openDialog()}
          title="⚙️"
        />
        <Button
          color={isSpeakingButton}
          onPress={() => this.toggleSpeak()}
          title={isSpeakingText}
        />
      </View>
    );
  }
}

export default withNavigation(Help);
