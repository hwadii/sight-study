import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  PixelRatio
} from "react-native";
import { Permissions } from "react-native-unimodules";
import Voice from "react-native-voice";

const letters = "nckzorhsdv";
const timeBetweenLetters = 500;
const screenFactor = 100 * PixelRatio.get() * 5 * 0.4;

export default class TestScreen extends Component {
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
    lineSize: Math.floor(screenFactor * Math.tan(Math.pow(10, 1.0) / 60.0)),
    lineNumber: 1,
    lineCoefficient: 1,
    whichEye: "left"
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
    this.setState({ letter: letters.random() });
    this.getNextLetterId = setInterval(
      () => this.getNextLetter(),
      timeBetweenLetters
    );
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
    clearInterval(this.getNextLetterId);
  }

  nextEye() {
    this.setState({
      letter: letters.random(),
      lineCoefficient: 1,
      lineSize: Math.floor(screenFactor * Math.tan(Math.pow(10, 1.0) / 60.0))
    });
  }

  endTest() {
    console.log("FIN");
    clearInterval(this.getNextLetterId);
  }

  getNextLetter() {
    const { letterCount, lineNumber, lineCoefficient } = this.state;
    const newLetterCount = letterCount + 1;
    let newLineNumber = lineNumber; // default is current line number
    let newLineCoefficient = lineCoefficient;
    if (newLetterCount % 5 === 0) {
      newLineNumber += 1; // +1 if it's a fifth letter
      newLineCoefficient -= 0.1;
    }
    const newLineSize = Math.floor(
      screenFactor * Math.tan(Math.pow(10, newLineCoefficient) / 60.0)
    );
    this.setState(
      {
        letter: letters.random(),
        letterCount: newLetterCount,
        lineNumber: newLineNumber,
        lineSize: newLineSize,
        lineCoefficient: newLineCoefficient
      },
      () => {
        const { lineNumber, letterCount, lineSize } = this.state;
        console.log(lineNumber, letterCount, lineSize);
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
    console.log("onSpeechRecognized: ", e);
    this.setState({
      recognized: "√"
    });
  };

  onSpeechEnd = e => {
    // eslint-disable-next-line
    console.log("onSpeechEnd: ", e);
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
    console.log("onSpeechVolumeChanged: ", e);
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
