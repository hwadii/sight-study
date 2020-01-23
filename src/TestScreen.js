import React, { Component, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  PixelRatio,
  PermissionsAndroid,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { Permissions } from "react-native-unimodules";
import Voice from "react-native-voice";
import * as Speech from "expo-speech";
import {
  intersection,
  getTargetLines,
  getAcuites,
  getQrSize,
  checkScoreAndSend
} from "./util";
import { styles as common } from "./styles/common";

import { getDistance, addScore } from "../service/db/User";
import { getId } from "./util";

import QRCodeScanner from "react-native-qrcode-scanner";

const letters = "nckzorhsdv";
const screenFactor = (160 * PixelRatio.get()) / 2.54;
/**
 * Gets font size for current line
 * @param {number} lineCoefficient acuité visuelle
 * @param {number} d distance en m
 */
const getLineLength = (lineCoefficient, d) =>
  Math.floor((screenFactor * 5 * 0.291 * d) / (10 * lineCoefficient));

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

    id: null,
    distance: null,

    // flow
    hasPressedStart: false,
    hasStarted: false,
    hasEnded: false,
    isPaused: false,

    // test
    letter: "",
    letterCount: 0,
    lineSize: null,
    lineNumber: 0,
    whichEye: "left",
    targetLines: null,
    scores: {
      left: 0,
      right: 0
    },

    // for distance
    indication: "",
    qrsize: 0,
    wellPlaced: false,
    wrongEyeCount: 0,
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

    const userId = await getId();
    const savedEtdrsScale = await getAcuites();
    const savedDistance = await getDistance(userId);
    const vs = Object.values(savedEtdrsScale);
    this.lineSizes = vs.map(v => getLineLength(v, savedDistance / 100)); // distance en m
    this.setState({
      id: userId,
      distance: savedDistance,
      qrsize: await getQrSize(),
      targetLines: await getTargetLines(),
      etdrsScale: savedEtdrsScale,
      lineSizes: this.lineSizes[0]
    });

    // this.timer = setInterval(this.tick, 1000);
    // this.setState({ timer: this.timer, eye: navigation.getParam("eye") });
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
    clearInterval(this.setNextLetterId);
    clearInterval(this.timer);
  }

  tick = () => {
    const { counter } = this.state;
    this.setState({
      counter: counter + 1
    });
    if (this.state.counter == 2) {
      this.setState({
        indication: "Veuillez vous placer devant l'écran",
        color: "black",
        wellPlaced: false,
        triggerTooClose: false,
        triggerTooFar: false,
        triggerWrongEye: false
      });
    }
    this.wrapRecognizer();
  };

  square = x => {
    return x * x;
  };

  onSuccess = e => {
    if (e.data == "sight-study") {
      const { distance, qrsize } = this.state;
      const eps = distance * 0.1;
      let limit = 0;
      if (this.state.whichEye === "left")
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
        (limit < e.bounds.height / 2 && this.state.whichEye === "left") ||
        (limit > e.bounds.height / 2 && this.state.whichEye === "right")
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
        tmp = (qrsize * 3030 * e.bounds.width) / (3 * 640 * tmp);
        var centre =
          e.bounds.width / 2 -
          (parseFloat(e.bounds.origin[0].x) +
            parseFloat(e.bounds.origin[1].x) +
            parseFloat(e.bounds.origin[2].x)) /
            3;
        var h =
          tmp *
          Math.sin((Math.PI * 35.84 * centre) / ((e.bounds.width / 2) * 180));
        var letterToCamera =
          (2.54 * Dimensions.get("window").height) /
          (Dimensions.get("window").scale * 160);
        var dis = Math.sqrt(
          letterToCamera * letterToCamera + tmp * tmp - 2 * 12.5 * h
        );

        if (dis - distance + eps < 0) {
          const amount = parseInt(10 * Math.abs(distance - dis)) / 10;
          this.setState({
            indication: `Eloignez vous de\n${amount} cm`,
            wellPlaced: false,
            wrongEyeCount: 0,
            counter: 0
          });
          if (!this.state.triggerTooClose) {
            // this.toggleSpeak("Veuillez reculer");
            this.setState({
              triggerTooClose: true,
              triggerTooFar: false,
              triggerWrongEye: false
            });
          }
        } else {
          if (dis - distance - eps > 0) {
            const amount = parseInt(10 * Math.abs(distance - dis)) / 10;
            this.setState({
              indication: `Rapprochez vous de\n${amount} cm`,
              wellPlaced: false,
              wrongEyeCount: 0,
              counter: 0
            });
            if (!this.state.triggerTooFar) {
              // this.toggleSpeak("Veuillez vous rapprocher");
              this.setState({
                triggerTooClose: false,
                triggerTooFar: true,
                triggerWrongEye: false
              });
            }
          } else {
            this.setState({
              indication: "Parfait, ne bougez plus",
              wellPlaced: true,
              wrongEyeCount: 0,
              counter: 0,
              triggerTooClose: false,
              triggerTooFar: false,
              triggerWrongEye: false
            });
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
        // this.toggleSpeak("Veuillez mettre le cache sur le bon oeil");
        this.setState({
          triggerTooClose: false,
          triggerTooFar: false,
          triggerWrongEye: true
        });
      }
    }
  };

  wrapRecognizer() {
    Voice.isRecognizing().then(isRecognizing => {
      if (!isRecognizing) this._startRecognizingIfTest();
    });
  }

  _startRecognizingIfTest() {
    const { wellPlaced, hasEnded, hasStarted, isPaused } = this.state;
    if (hasStarted && !hasEnded && !isPaused) {
      this._startRecognizing();
      // if (wellPlaced) {
      //   console.log("started....");
      // }
    }
  }

  speak(
    sentence,
    onStart = null,
    onDone = () => this._startRecognizingIfTest()
  ) {
    Speech.speak(sentence, {
      language: "fr",
      onStart,
      onDone
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

  nextEye() {
    this.setState({
      whichEye: "right",
      isPaused: true
    });
  }

  endTest() {
    this.setState(
      {
        hasEnded: true
      },
      () => {
        console.log("FIN DU TEST");
        const { id, scores } = this.state;
        addScore(id, scores.left, scores.droit);
        checkScoreAndSend(id, scores);
        Voice.destroy().then(Voice.removeAllListeners);
        clearInterval(this.setNextLetterId);
        clearInterval(this.timer);
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
    const { letterCount, lineNumber, targetLines } = this.state;
    const { hasEnded, hasStarted, isPaused } = this.state;
    const newLetterCount = letterCount + 1;
    let newLineNumber = lineNumber; // default is current line number
    if (letterCount % 5 === 0) {
      newLineNumber += 1; // +1 if it's a fifth letter
    }
    const newIdx = (newLineNumber - 1) % targetLines;

    if (!hasEnded && hasStarted && !isPaused) {
      this.setState(
        {
          letter: letters.random(),
          letterCount: newLetterCount,
          lineNumber: newLineNumber,
          lineSize: this.lineSizes[newIdx]
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
          if (letterCount === targetLines * 5) this.nextEye();
          if (letterCount === targetLines * 10) this.endTest();
          if (letterCount <= targetLines * 10) this.wrapRecognizer();
        }
      );
    }
  }

  onSpeechError = e => {
    console.log("onSpeechError: ", e);
    // no speech
    if (e.error.message === "6/No speech input") {
      this.setNextLetter();
    }
    // no match
    if (e.error.message === "7/No match") {
      this._destroyRecognizer();
      this.toggleSpeak("Je ne vous ai pas entendu. Veuillez répéter.");
    }
    this.setState({
      error: e.error.message
    });
  };

  onSpeechResults = e => {
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

  handlePause() {
    this.setState(
      prevState => ({
        isPaused: !prevState.isPaused
      }),
      () => {
        const { isPaused } = this.state;
        if (isPaused) this._destroyRecognizer();
        if (!isPaused) this._startRecognizing();
      }
    );
  }

  render() {
    const {
      letter,
      lineSize,
      targetLines,
      scores,
      indication,
      wellPlaced
    } = this.state;
    const { hasPressedStart, hasStarted, hasEnded, isPaused } = this.state;
    const { goBack } = this.props.navigation;
    return (
      <View style={styles.container}>
        {/* {!hasEnded && <HiddenQrCode onSuccess={this.onSuccess.bind(this)} />} */}
        {!hasPressedStart && (
          <Instructions
            wellPlaced={true}
            handleStartPressed={() => this.setState({ hasPressedStart: true })}
          />
        )}
        {!hasStarted && hasPressedStart && (
          <Countdown handleStart={this.handleStartPressed.bind(this)} />
        )}
        {hasStarted && !hasEnded && !isPaused && (
          <Text style={{ fontFamily: "optician-sans", fontSize: lineSize }}>
            {letter}
          </Text>
        )}
        {/* {!wellPlaced && <Text style={styles.indication}>{indication}</Text>} */}
        {isPaused && (
          <ChangeEye
            wellPlaced={true}
            handlePause={this.handlePause.bind(this)}
          />
        )}
        {hasEnded && (
          <Score
            scores={scores}
            targetLines={targetLines}
            handleOnEnd={goBack.bind(this)}
          />
        )}
      </View>
    );
  }
}

function Lines({ lineSizes }) {
  return lineSizes.map(lineSize => (
    <Text
      key={Math.random().toString()}
      style={{ fontFamily: "optician-sans", fontSize: lineSize }}
    >
      n c k z o r h s d v
    </Text>
  ));
}

function HiddenQrCode({ onSuccess }) {
  return (
    <QRCodeScanner
      onRead={onSuccess}
      vibrate={false}
      reactivate={true}
      containerStyle={{ position: "absolute", opacity: 0 }}
      cameraType="front"
    />
  );
}

function Instructions({ handleStartPressed, wellPlaced }) {
  return (
    <>
      <Text style={common.headers}>Test de vision</Text>
      <Text style={common.important}>
        Nous allons évaluer votre{" "}
        <Text style={{ fontWeight: "bold" }}>œil gauche</Text>. Veuillez enfiler
        les lunettes cachant votre{" "}
        <Text style={{ fontWeight: "bold" }}>œil droit</Text>.
      </Text>
      <Text style={common.important}>
        Placez-vous confortablement et appuyez sur le bouton lorsque vous êtes
        prêt.
      </Text>
      {wellPlaced && (
        <TouchableOpacity
          style={styles.actionButtons}
          onPress={() => handleStartPressed()}
        >
          <Text style={styles.actionButtonsText}>PRÊT</Text>
        </TouchableOpacity>
      )}
    </>
  );
}

function ChangeEye({ handlePause, wellPlaced }) {
  return (
    <>
      <Text style={common.headers}>Test de vision</Text>
      <Text style={common.important}>
        Nous allons évaluer votre{" "}
        <Text style={{ fontWeight: "bold" }}>œil droit</Text>. Veuillez enfiler
        les lunettes cachant votre{" "}
        <Text style={{ fontWeight: "bold" }}>œil gauche</Text>.
      </Text>
      <Text style={common.important}>
        Placez-vous confortablement et appuyez sur le bouton lorsque vous êtes
        prêt.
      </Text>
      {wellPlaced && (
        <TouchableOpacity
          style={styles.actionButtons}
          onPress={() => handlePause()}
        >
          <Text style={styles.actionButtonsText}>CONTINUER</Text>
        </TouchableOpacity>
      )}
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

function Score({ scores, targetLines, handleOnEnd }) {
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
    // position: 'absolute',
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative"
  },
  actionButtons: {
    ...common.actionButtons,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: Dimensions.get("window").width - 20,
    height: 300,
    position: "absolute",
    bottom: 0,
    marginBottom: 20
  },
  actionButtonsText: {
    ...common.actionButtonsText,
    fontSize: 30
  },
  countdown: {
    fontSize: 46,
    fontWeight: "bold"
  },
  indication: { fontSize: 30 }
});
