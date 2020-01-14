import React, { Component } from "react";
import { Button, StyleSheet, Text, View, PixelRatio } from "react-native";
import { Permissions } from "react-native-unimodules";
import Voice from "react-native-voice";

const letters = "nckzorhsdv";
const timeBetweenLetters = 500;
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
  }
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
    }
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
    // this.setNextLetterId = setInterval(
    //   () => this.setNextLetter(),
    //   timeBetweenLetters
    // );
    this.setNextLetter();
    // this._startRecognizing();
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
    // clearInterval(this.setNextLetterId);
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
    // clearInterval(this.setNextLetterId);
  }

  checkResults() {

  }

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
    const { letter, lineSize } = this.state;
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: lineSize }}>{letter}</Text>
        <Button title="Start" onPress={() => this._startRecognizing()}/>
        <Button title="Stop" onPress={() => this._stopRecognizing()}/>
        <Button title="Destroy" onPress={() => this._destroyRecognizer()}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
