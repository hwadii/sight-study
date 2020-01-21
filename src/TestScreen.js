import React, { Component, useState, useEffect } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  PixelRatio,
  TouchableOpacity
} from "react-native";
import { Permissions } from "react-native-unimodules";
import Voice from "react-native-voice";
import * as Speech from "expo-speech";
import { intersection, defaultEtdrsScale } from "./util";
import { styles as common } from "./styles/common";

const letters = "nckzorhsdv";
const timeBetweenLetters = 200;
const screenFactor = (160 * PixelRatio.get()) / 2.54;
/**
 * Gets font size for current line
 * @param {number} lineCoefficient acuité visuelle
 * @param {number} d distance en cm
 */
const getLineLength = (lineCoefficient, d) =>
  Math.floor((screenFactor * 5 * 0.291 * d) / (10 * lineCoefficient));
const vs = Object.values(defaultEtdrsScale);
const lineSizes = vs.map(v => getLineLength(v, 0.4));
const targetLines = 1;

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

    hasPressedStart: false,
    hasStarted: false,
    hasEnded: false,
    letter: "",
    letterCount: 0,
    lineSize: lineSizes[0],
    lineNumber: 0,
    whichEye: "right",
    scores: {
      left: 0,
      right: 0
    },

    // for tests
    tests: {
      hideButtons: false
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
    this.setNextLetter();
    this.willBlurSub = this.props.navigation.addListener("willBlur", () => {
      Voice.destroy().then(Voice.removeAllListeners);
    });
    // this.intervalId = setInterval(
    //   () => this.setNextLetter(),
    //   timeBetweenLetters
    // );
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
    this.willBlurSub.remove();
    clearInterval(this.intervalId);
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

  nextEye() {
    this.setState({
      whichEye: "left"
    });
  }

  endTest() {
    this.setState(
      {
        hasEnded: true
      },
      () => {
        console.log("FIN DU TEST");
        this._destroyRecognizer();
      }
    );
  }

  checkResults(newResults) {
    const { letter } = this.state;
    return intersection(newResults, letter);
  }

  getNewScore(newResults) {
    const { scores, whichEye } = this.state;
    const gotResult = this.checkResults(newResults);
    const newScore = gotResult ? scores[whichEye] + 1 : scores[whichEye];
    return newScore;
  }

  setNextLetter() {
    const { letterCount, lineNumber, hasEnded, hasStarted } = this.state;
    const newLetterCount = letterCount + 1;
    let newLineNumber = lineNumber; // default is current line number
    if (letterCount % 5 === 0) {
      newLineNumber += 1; // +1 if it's a fifth letter
    }
    const newIdx = (newLineNumber - 1) % targetLines;

    if (!hasEnded && hasStarted) {
      this.setState(
        {
          letter: letters.random(),
          letterCount: newLetterCount,
          lineNumber: newLineNumber,
          lineSize: lineSizes[newIdx]
        },
        () => {
          const {
            letter,
            letterCount,
            lineNumber,
            whichEye,
            lineSize
          } = this.state;
          console.log(
            `${letter} => ${letterCount}:${lineNumber} ${targetLines *
              5} with height ${lineSize} and idx ${newIdx} -> ${whichEye}`
          );
          if (letterCount === targetLines * 5) {
            this.nextEye();
            this._startRecognizing();
          } else if (letterCount === targetLines * 10) this.endTest();
          else this._startRecognizing();
        }
      );
    }
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
    this.setState({
      end: "√"
    });
  };

  onSpeechError = e => {
    // eslint-disable-next-line
    console.log("onSpeechError: ", e);
    // no speech
    if (e.error.message === "6/No speech input") {
      this.setNextLetter();
    }
    // no match
    if (e.error.message === "7/No match") {
      Speech.speak("Je ne vous ai pas entendu. Veuillez répéter.", {
        language: "fr",
        onDone: () => this._startRecognizing()
      });
    }
    this.setState({
      error: JSON.stringify(e.error)
    });
  };

  onSpeechResults = e => {
    // eslint-disable-next-line
    const { partialResults, scores, whichEye } = this.state;
    const newResults = [...e.value, ...partialResults];
    console.log("onSpeechResults: ", newResults);
    this.setState(
      {
        results: newResults,
        scores: { ...scores, [whichEye]: this.getNewScore(newResults) }
      },
      () => {
        console.log(`current score: ${JSON.stringify(this.state.scores)}`);
        this.setNextLetter();
      }
    );
  };

  onSpeechPartialResults = e => {
    // eslint-disable-next-line
    console.log("onSpeechPartialResults: ", e);
    this.setState({
      partialResults: e.value
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

  handleStartPressed() {
    this.setState(
      {
        hasStarted: true
      },
      () => this.setNextLetter()
    );
  }

  render() {
    const {
      letter,
      lineSize,
      hasPressedStart,
      hasStarted,
      hasEnded,
      scores
    } = this.state;
    const { goBack } = this.props.navigation;
    return (
      <View style={styles.container}>
        {!hasStarted && hasPressedStart && (
          <Countdown handleStart={this.handleStartPressed.bind(this)} />
        )}
        {!hasPressedStart && (
          <Instructions
            handleStartPressed={() => this.setState({ hasPressedStart: true })}
          />
        )}
        {hasStarted && !hasEnded && (
          <>
            <Text style={{ fontFamily: "optician-sans", fontSize: lineSize }}>
              {letter}
            </Text>
            <Button title="Next" onPress={() => this.setNextLetter()} />
            <Button title="Quit" onPress={() => goBack()} />
          </>
        )}
        {hasEnded && <Score scores={scores} handleOnEnd={goBack.bind(this)} />}
      </View>
    );
  }
}

function Lines() {
  return lineSizes.map(lineSize => (
    <Text
      key={Math.random().toString()}
      style={{ fontFamily: "optician-sans", fontSize: lineSize }}
    >
      n c k z o r h s d v
    </Text>
  ));
}

function Instructions({ handleStartPressed }) {
  return (
    <>
      <Text style={common.headers}>Test de vision</Text>
      <Text style={common.important}>
        Nous allons évaluer votre œil gauche. Veuillez enfiler les lunettes
        cachant votre œil droit.
      </Text>
      <Text style={common.important}>
        Appuyez sur le bouton lorsque vous êtes prêt.
      </Text>
      <TouchableOpacity
        style={styles.actionButtons}
        onPress={() => handleStartPressed()}
      >
        <Text style={common.actionButtonsText}>PRÊT</Text>
      </TouchableOpacity>
    </>
  );
}

function Countdown({ handleStart }) {
  const [counter, setCounter] = useState(3);
  let intervalId;
  useEffect(() => {
    intervalId = setInterval(() => {
      setCounter(counter - 1);
    }, 1000);
    if (counter === 0) {
      clearInterval(intervalId);
      handleStart();
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [counter]);
  return counter > 0 ? <Text style={styles.countdown}>{counter}</Text> : null;
}

function Score({ scores, handleOnEnd }) {
  const { right, left } = scores;
  const target = targetLines * 5;
  return (
    <>
      <Text style={common.headers}>Fin du test</Text>
      <Text style={common.important}>Le test est maintenant terminé.</Text>
      <Text style={common.important}>
        Score œil droit:{" "}
        <Text style={{ fontWeight: "bold" }}>
          {right} / {target}
        </Text>
      </Text>
      <Text style={common.important}>
        Score œil gauche:{" "}
        <Text style={{ fontWeight: "bold" }}>
          {left} / {target}
        </Text>
      </Text>
      <TouchableOpacity
        style={styles.actionButtons}
        onPress={() => handleOnEnd()}
      >
        <Text style={common.actionButtonsText}>TERMINER</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  actionButtons: {
    ...common.actionButtons,
    marginTop: 8
  },
  countdown: {
    fontSize: 46,
    fontWeight: "bold"
  }
});
