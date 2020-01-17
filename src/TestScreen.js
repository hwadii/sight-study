import React, { Component } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  PixelRatio,
  Image,
  PermissionsAndroid
} from "react-native";
import { Permissions } from "react-native-unimodules";
import Voice from "react-native-voice";
import * as Speech from "expo-speech";
import * as Font from "expo-font";

import { getDistance } from "../service/db/User";
import { getId } from "./util";

import QRCodeScanner from "react-native-qrcode-scanner";

const letters = "nckzorhsdv";
const timeBetweenLetters = 4000;
const screenFactor = 100 * PixelRatio.get() * 5 * 0.4;
/**
 * Gets font size for current line
 * @param {number} lineCoefficient coefficient de ligne
 */
const getLineLength = lineCoefficient =>
  Math.floor(screenFactor * Math.tan(Math.pow(10, lineCoefficient) / 60));

export default class TestScreen extends Component {
  static navigationOptions = {
    headerShown: false
  };
  state = {
    recognized: "",
    pitch: "",
    error: "",
    end: "",
    started: "",
    results: [],
    partialResults: [],

    letter: "",
    letterCount: 0,
    lineSize: getLineLength(1),
    lineNumber: 0,
    lineCoefficient: 1,
    whichEye: "left",
    scores: {
      left: 0,
      right: 0
    },

    // for tests
    tests: {
      hideButtons: false
    },

    // for distance
    id: "",
    indication: " ",
    wellPlaced: false,
    wrongEyeCount: 0,
    eye: "",
    timer: null,
    counter: 0,
    triggerTooClose: false,
    triggerTooFar: false,
    triggerWrongEye: false
  };

  constructor(props) {
    super(props);
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechRecognized = this.onSpeechRecognized;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;
  }

  async componentDidMount() {
    const { status, expires, permissions } = await Permissions.askAsync(
      Permissions.AUDIO_RECORDING
    );
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    );
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);

    const currentuser_id = await getId();
    // this.setNextLetterId = setInterval(
    //   () => this.setNextLetter(),
    //   timeBetweenLetters
    // );
    this.setNextLetter();
    // this._startRecognizing();

    const { navigation } = this.props;

    this.setState({
      id: currentuser_id,
      distance: await getDistance(currentuser_id)
    });

    this.timer = setInterval(this.tick, 1000);
    this.setState({ timer: this.timer, eye: navigation.getParam("eye") });
  }

  tick = () => {
    this.setState({
      counter: this.state.counter + 1
    });
    if (this.state.counter == 2) {
      this.setState({
        indication: "Veuillez vous placer devant l'écran",
        color: "black",
        wellPlaced: false
      });
      this.toggleSpeak("Veuillez vous placer devant l'écran");
      this.state.triggerTooClose = false;
      this.state.triggerTooFar = false;
      this.state.triggerWrongEye = false;
    }
  };

  square = x => {
    return x * x;
  };

  onSuccess = e => {
    if (e.data == "sight-study") {
      var distance = this.state.distance[0].distance;
      var eps = distance * 0.05;

      var limit = 0;
      if (this.state.eye == "left")
        limit = Math.min(
          e.bounds.origin[0].y,
          e.bounds.origin[0].y,
          e.bounds.origin[0].y
        );
      else
        limit = Math.max(
          e.bounds.origin[0].y,
          e.bounds.origin[0].y,
          e.bounds.origin[0].y
        );

      if (
        (limit < e.bounds.height / 2 && this.state.eye == "left") ||
        (limit > e.bounds.height / 2 && this.state.eye == "right")
      ) {
        var tmp = Math.sqrt(
          this.square(e.bounds.origin[1].y - e.bounds.origin[0].y) +
            this.square(e.bounds.origin[1].x - e.bounds.origin[0].x)
        );
        tmp =
          tmp +
          Math.sqrt(
            this.square(e.bounds.origin[2].y - e.bounds.origin[1].y) +
              this.square(e.bounds.origin[2].x - e.bounds.origin[1].x)
          );
        tmp =
          tmp +
          Math.sqrt(
            this.square(e.bounds.origin[0].y - e.bounds.origin[2].y) +
              this.square(e.bounds.origin[0].x - e.bounds.origin[2].x)
          );
        tmp = 7520 / tmp;

        if (tmp - distance + eps < 0) {
          this.setState({
            indication:
              "Eloignez vous de\n" +
              parseInt(10 * Math.abs(distance - tmp)) / 10 +
              " cm",
            wellPlaced: false,
            wrongEyeCount: 0,
            counter: 0
          });
          if (!this.state.triggerTooClose) {
            this.toggleSpeak("Veuillez reculer");
            this.state.triggerTooClose = true;
            this.state.triggerTooFar = false;
            this.state.triggerWrongEye = false;
          }
        } else {
          if (tmp - distance - eps > 0) {
            this.setState({
              indication:
                "Rapprochez vous de\n" +
                parseInt(10 * Math.abs(distance - tmp)) / 10 +
                " cm",
              wellPlaced: false,
              wrongEyeCount: 0,
              counter: 0
            });
            if (!this.state.triggerTooFar) {
              this.toggleSpeak("Veuillez vous rapprocher");
              this.state.triggerTooClose = false;
              this.state.triggerTooFar = true;
              this.state.triggerWrongEye = false;
            }
          } else {
            this.setState({
              indication: "Parfait, ne bougez plus",
              wellPlaced: true,
              wrongEyeCount: 0,
              counter: 0
            });
            this.state.triggerTooClose = false;
            this.state.triggerTooFar = false;
            this.state.triggerWrongEye = false;
          }
        }
      } else {
        this.setState({
          wrongEyeCount: this.state.wrongEyeCount + 1,
          counter: 0
        });
      }
    } else console.log("pas bon qr code");

    if (this.state.wrongEyeCount >= 4) {
      this.setState({
        indication: "Veuillez tester le bon oeil",
        wellPlaced: false
      });
      if (!this.state.triggerWrongEye) {
        this.toggleSpeak("Veuillez mettre le cache sur le bon oeil");
        this.state.triggerTooClose = false;
        this.state.triggerTooFar = false;
        this.state.triggerWrongEye = true;
      }
    }
  };

  speak(sentence) {
    Speech.speak(sentence, {
      language: "fr"
    });
  }

  stop() {
    Speech.stop();
  }

  toggleSpeak(sentence) {
    Speech.isSpeakingAsync()
      .then(isSpeaking => (isSpeaking ? this.stop() : this.speak(sentence)))
      .catch(console.error);
  }

  // for tests
  randomize() {
    this.setNextLetterId = setInterval(
      () => this.setNextLetter(),
      timeBetweenLetters
    );
  }

  toggleButtons() {
    const { tests } = this.state;
    this.setState({
      tests: {
        hideButtons: tests.hideButtons ? false : true
      }
    });
  }
  // !for tests

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
    clearInterval(this.setNextLetterId);
    clearInterval(this.timer);
  }

  nextEye() {
    this.setState({
      letter: letters.random(),
      lineCoefficient: 1,
      lineSize: getLineLength(1),
      whichEye: "right"
    });
  }

  endTest() {
    console.log("FIN");
  }

  checkResults() {}

  getNewScore() {
    const { scores, whichEye } = this.state;
    const gotResult = Math.random() < 0.8 ? true : false;
    let newScore = gotResult ? scores[whichEye] + 1 : scores[whichEye];
    return newScore;
  }

  setNextLetter() {
    const {
      letterCount,
      lineNumber,
      lineCoefficient,
      whichEye,
      scores
    } = this.state;
    const newLetterCount = letterCount + 1;
    let newLineNumber = lineNumber; // default is current line number
    let newLineCoefficient = lineCoefficient;
    if (letterCount % 5 === 0) {
      newLineNumber += 1; // +1 if it's a fifth letter
      newLineCoefficient -= 0.1;
    }
    this.setState(
      {
        letter: letters.random(),
        letterCount: newLetterCount,
        lineNumber: newLineNumber,
        lineSize: getLineLength(newLineCoefficient),
        lineCoefficient: newLineCoefficient,
        scores: { ...scores, [whichEye]: this.getNewScore() }
      },
      () => {
        const {
          lineNumber,
          letterCount,
          lineSize,
          whichEye,
          scores
        } = this.state;
        console.log(lineNumber, letterCount, lineSize, whichEye);
        console.log(scores);
        if (letterCount === 25) this.nextEye();
        if (letterCount === 50) this.endTest();
      }
    );
  }

  onSpeechStart = e => {
    // eslint-disable-next-line
    console.log("onSpeechStart: ", e);
    this.setState({
      started: "√"
    });
  };

  onSpeechRecognized = e => {
    // eslint-disable-next-line
    // console.log("onSpeechRecognized: ", e);
    this.setState({
      recognized: "√"
    });
  };

  onSpeechEnd = e => {
    // eslint-disable-next-line
    console.log("onSpeechEnd: ", e);
    this.setNextLetter();
    // this._startRecognizing();
    this.setState({
      end: "√"
    });
  };

  onSpeechError = e => {
    // eslint-disable-next-line
    console.log("onSpeechError: ", e);
    this.setState({
      error: JSON.stringify(e.error)
    });
  };

  onSpeechResults = e => {
    // eslint-disable-next-line
    console.log("onSpeechResults: ", e);
    this.setState({
      results: e.value
    });
  };

  onSpeechPartialResults = e => {
    // eslint-disable-next-line
    console.log("onSpeechPartialResults: ", e);
    this.setState({
      partialResults: e.value
    });
  };

  onSpeechVolumeChanged = e => {
    // eslint-disable-next-line
    // console.log("onSpeechVolumeChanged: ", e);
    this.setState({
      pitch: e.value
    });
  };

  _startRecognizing = async () => {
    this.setState({
      recognized: "",
      pitch: "",
      error: "",
      started: "",
      results: [],
      partialResults: [],
      end: ""
    });

    try {
      await Voice.start("fr-FR");
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  _stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  _cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  _destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
    this.setState({
      recognized: "",
      pitch: "",
      error: "",
      started: "",
      results: [],
      partialResults: [],
      end: ""
    });
  };

  render() {
    const { letter, lineSize, tests } = this.state;
    return (
      <View style={styles.container}>
        <QRCodeScanner
          onRead={this.onSuccess}
          vibrate={false}
          reactivate={true}
          containerStyle={{ position: "absolute", opacity: 0 }}
          cameraType="front"
        />
        <Text style={{ fontFamily: "optician-sans", fontSize: lineSize }}>
          {letter}
        </Text>
        {!tests.hideButtons && (
          <>
            <Button title="Start" onPress={() => this._startRecognizing()} />
            <Button title="Stop" onPress={() => this._stopRecognizing()} />
            <Button title="Destroy" onPress={() => this._destroyRecognizer()} />
            <Button title="Randomize" onPress={() => this.randomize()} />
          </>
        )}
        <Button
          title={tests.hideButtons ? "Show" : "Hide"}
          onPress={() => this.toggleButtons()}
        />
        <Text style={{ fontFamily: "optician-sans", fontSize: 30 }}>
          {this.state.indication}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // position: 'absolute',
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
