import React from "react";
import * as Speech from "expo-speech";
import { View, Button } from "react-native";
import { withNavigation } from "react-navigation";
import { colors } from "./styles/common";

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
      isSpeakingButton: colors.DANGER
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

  componentDidMount() {
    this.didFocusSub = this.props.navigation.addListener("didFocus", () => {
      this.speak();
    });
    this.willBlurSub = this.props.navigation.addListener("willBlur", () => {
      this.stop();
    });
  }

  componentWillUnmount() {
    this.didFocusSub.remove();
    this.willBlurSub.remove();
  }

  render() {
    const { isSpeakingText, isSpeakingButton } = this.state;
    return (
      <View style={{ marginHorizontal: 10 }}>
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
