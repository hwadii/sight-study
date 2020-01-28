import React, { Component, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  PixelRatio,
  Dimensions,
  TouchableOpacity,
  PermissionsAndroid,
  Image
} from "react-native";
import Voice from "react-native-voice";
import * as Speech from "expo-speech";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";
import {
  intersection,
  getTargetLines,
  getAcuites,
  getQrSize,
  checkScoreAndSend,
  testSuite,
  mailEnum,
  showAlert
} from "./util";
import { styles as common } from "./styles/common";

import { getDistance, addScore, getScore, resetDB } from "../db";
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

const mic_on = require("../assets/mic_on.png");
const mic_off = require("../assets/mic_off.png");

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
    rec: false,
    speaking: false,

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
    errorsInLine: 0,
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
    detectWellPlaced: false,
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
    // Desactive la mise en veille de l'ecran
    activateKeepAwake();
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.CAMERA
    ]);

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

    // Timer pour contrôler la detection de l'utilisateur dans le champs
    this.timer = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    this._destroyRecognizer();
    Voice.destroy().then(Voice.removeAllListeners);
    Speech.stop();
    clearInterval(this.timer);
    clearTimeout(this.timerPlacement);

    // Reactive la mise en veille de l'ecran
    deactivateKeepAwake();
  }

  // Contrôler la detection de l'utilisateur dans le champs
  // Le compteur est incremente toutes les secondes
  // Si le QR COde et détecté, le compteur est remis à 0
  // Si le compteur atteint les 2 sec, on considere que l'utilisateur est hors du champs
  tick = () => {
    const { counter } = this.state;
    this.wrapRecognizer();
    this.setState({
      counter: counter + 1
    });
    if (this.state.counter == 2) {
      this.setState({
        indication: "Veuillez vous placer devant l'écran",
        color: "black",
        detectWellPlaced: false,
        triggerTooClose: false,
        triggerTooFar: false,
        triggerWrongEye: false
      });
      this.timerPlacement = setTimeout(this.timeoutFunction, 200);
    }
  };

  square = x => x * x;

  // Controle si une sortie de l'ecran ou une mauvaise position du QR Code
  // a eu lieu et n'a pas été corrigé en 200ms
  timeoutFunction = () => {
    if (!this.state.detectWellPlaced && this.state.wellPlaced) {
      this.setState({ wellPlaced: false });
      this._destroyRecognizer();
    }
  };

  // Fonction appelee lors d'une detection de QR Code.
  //
  // Calcule la distance du QR Code,
  // si elle est a plus ou moins 5% de la distance de l'utilisateur, la distance est validee
  // si la distance est en dehors on demarre un timer pour controler s'il est toujours mal positionné apres 200ms
  // dans ce cas, on affiche s'il est trop loin ou trop pres
  // Controle aussi si le QR Code est du bon coté de l'image
  onSuccess = e => {
    const { hasPressedStart, hasStarted } = this.state;
    const badlyPlaced = () => {
      this.timerPlacement = setTimeout(this.timeoutFunction, 200);
    };
    if (hasPressedStart && !hasStarted) {
      this.setState({ wellPlaced: true });
      return;
    }
    if (e.data == "sight-study") {
      const { distance, qrsize } = this.state;
      const eps = distance * 0.05;
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

      // Verifie si le QR Code est du bon cote de l'image
      if (
        (limit < e.bounds.height / 2 && this.state.whichEye === "left") ||
        (limit > e.bounds.height / 2 && this.state.whichEye === "right")
      ) {
        // Calcul de la distance oeil-lettre
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

        // Si on est trop proche de la lettre (a 5%)
        if (dis - distance + eps < 0) {
          const amount = parseInt(10 * Math.abs(distance - dis)) / 10;
          this.setState(
            {
              indication: `Eloignez vous de\n${amount} cm`,
              detectWellPlaced: false,
              wrongEyeCount: 0,
              counter: 0
            },
            badlyPlaced
          );
          if (!this.state.triggerTooClose) {
            // this.toggleSpeak("Veuillez reculer");
            this.setState({
              triggerTooClose: true,
              triggerTooFar: false,
              triggerWrongEye: false
            });
          }
        } else {
          // Si on est trop loin de la lettre (a 5%)
          if (dis - distance - eps > 0) {
            const amount = parseInt(10 * Math.abs(distance - dis)) / 10;
            this.setState(
              {
                indication: `Rapprochez vous de\n${amount} cm`,
                detectWellPlaced: false,
                wrongEyeCount: 0,
                counter: 0
              },
              badlyPlaced
            );
            if (!this.state.triggerTooFar) {
              // this.toggleSpeak("Veuillez vous rapprocher");
              this.setState({
                triggerTooClose: false,
                triggerTooFar: true,
                triggerWrongEye: false
              });
            }
          } else {
            // Si on est bien placé (a 5%)
            this.setState(
              {
                indication: "Parfait, ne bougez plus",
                wellPlaced: true,
                detectWellPlaced: true,
                wrongEyeCount: 0,
                counter: 0,
                triggerTooClose: false,
                triggerTooFar: false,
                triggerWrongEye: false
              },
              () => clearTimeout(this.timerPlacement)
            );
          }
        }
      } else {
        // Si le QR Code est du mauvais cote de l'image donc sur le mauvais oeil
        this.setState({
          wrongEyeCount: this.state.wrongEyeCount + 1,
          counter: 0
        });
      }
    } else console.log("pas bon qr code");

    // Si le QR Code est detecté sur le mauvais oeil 4 fois consecutivement
    if (this.state.wrongEyeCount >= 4) {
      this.setState(
        {
          indication: "Veuillez tester le bon oeil",
          detectWellPlaced: false
        },
        badlyPlaced
      );
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

  // Demarre la reconnaissance vocale s'il n'est pas deja demarre
  wrapRecognizer() {
    Speech.isSpeakingAsync().then(isSpeaking => {
      if (!this.state.rec && !isSpeaking) this._startRecognizingIfTest();
    });
  }

  // Demarre la reconnaissance si le test est en cours
  _startRecognizingIfTest() {
    const { wellPlaced, hasEnded, hasStarted, isPaused } = this.state;
    if (!wellPlaced) return;

    if (hasStarted && !hasEnded && !isPaused) {
      this.setState({ rec: true });
      this._startRecognizing();
    }
  }

  /**
   * Synthèse vocale
   * @param {string} sentence phrase à prononcer
   * @param {Function} onStart fonction executée au début de la synthèse
   * @param {Function} onDone fonction executée à la fin de la synthèse
   */
  speak(
    sentence,
    onStart = () => {
      this.setState({ speaking: true });
    },
    onDone = () => {
      this.setState({ speaking: false });
      this._startRecognizingIfTest();
    }
  ) {
    Speech.speak(sentence, {
      language: "fr",
      onStart,
      onDone
    });
  }

  // Stoppe la voix
  stop() {
    Speech.stop();
  }

  // Declenche la synthese vocale
  toggleSpeak(sentence) {
    Speech.isSpeakingAsync()
      .then(isSpeaking => {
        if (isSpeaking) this.stop();
        else {
          this.speak(sentence);
        }
      })
      .catch(console.error);
  }

  // Change l'oeil a tester
  nextEye() {
    this.setState({
      whichEye: "right",
      isPaused: true
    });
  }

  // Fonction executee a la fin du test
  // Compare le score avec l'historique des scores
  // Si sur un oeil l'utilisateur trouve au moins 3 lettres de moins par rapport au dernier test, un mail est envoye
  // Si sur un oeil l'utilisateur trouve au moins 4 lettres de moins par rapport a l'avant dernier test, un mail est envoye
  endTest() {
    this.setState(
      {
        hasEnded: true
      },
      async () => {
        Voice.destroy().then(Voice.removeAllListeners);
        clearInterval(this.setNextLetterId);
        clearInterval(this.timer);
        console.log("FIN DU TEST");
        const { targetLines } = this.state;
        const id = await getId();
        const { scores } = this.state;
        await addScore(id, scores.left, scores.right, targetLines * 10);
        const gotPerformance = await checkScoreAndSend(id, targetLines * 10);
        if (gotPerformance === mailEnum.INSUFFISCIENT) {
          showAlert(
            "Vous avez passé le test. Vos résultats indiquent un problème et un mail a été envoyé à votre docteur.",
            null,
            [],
            "Attention !"
          );
        }
      }
    );
  }

  /**
   * Vérifie si les résultats obtenus correspondent à la table d'equivalence
   * @param {string[]} newResults tableau contenant les mots reconnus par la reconnaissance
   * @returns {boolean}
   */
  checkResults(newResults) {
    const { letter } = this.state;
    return intersection(newResults, letter);
  }

  /**
   * Calcule le nouveau score et détermine s'il y a une erreur
   * @param {string[]} newResults tableau contenant les mots reconnus par la reconnaissance
   * @returns {[number, boolean]} retourne le nouveau score et un booleen indiquant s'il
   *                              y a eu une erreur
   */
  getNewScore(newResults) {
    const { scores, whichEye } = this.state;
    const gotResult = this.checkResults(newResults);
    const gotErrors = !gotResult;
    const newScore = gotResult ? scores[whichEye] + 1 : scores[whichEye];
    return [newScore, gotErrors];
  }

  /**
   * Met à jour la lettre lue et effectue tous les changements nécessaires
   * ex: fin de ligne -> incrémente la ligne
   */
  setNextLetter() {
    const { hasEnded, hasStarted, isPaused } = this.state;
    // quitte tôt si pas en cours de test
    if (hasEnded || !hasStarted || isPaused) return;

    const { letterCount, lineNumber, targetLines, errorsInLine } = this.state;
    let newLineNumber = lineNumber; // default is current line number
    let newErrorsInLine = errorsInLine;
    let newLetterCount = letterCount;

    if (newErrorsInLine === 2) {
      newLetterCount = 5 * (parseInt(parseFloat(letterCount) / 5) + 1) + 1;
    } else {
      newLetterCount = letterCount + 1;
    }

    if (newLetterCount % 5 === 1) {
      newLineNumber += 1; // +1 if it's a fifth letter
      newErrorsInLine = 0;
    }

    const newIdx = (newLineNumber - 1) % targetLines;

    this.setState(
      {
        letter: letters.random(),
        letterCount: newLetterCount,
        lineNumber: newLineNumber,
        lineSize: this.lineSizes[newIdx],
        errorsInLine: newErrorsInLine
      },
      () => {
        if (letterCount === targetLines * 5 + 1) this.nextEye();
        if (letterCount === targetLines * 10 + 1) this.endTest();
        if (letterCount <= targetLines * 10) this._startRecognizing();
      }
    );
  }

  // Fonction lors de detection d'une erreur de reconnaissance vocale
  // Si rien n'a ete dit, c'est une erreur et on passe a la lettre suivante
  // Si aucun mot n'a ete reconnu, on demande de repeter
  onSpeechError = e => {
    console.log("onSpeechError: ", e);
    // no speech
    if (e.error.message === "6/No speech input") {
      const { errorsInLine } = this.state;
      this.setState({ errorsInLine: errorsInLine + 1 }, () =>
        this.setNextLetter()
      );
    }
    // no match
    if (e.error.message === "7/No match") {
      this.toggleSpeak("Je ne vous ai pas compris. Veuillez répéter.");
    }
    this.setState({
      error: e.error.message
    });
  };

  /**
   * Méthode executée lorsque la reconnaissance retourne un résultat
   * - on met à jour le score
   * - on vérifie s'il n'y a pas eu d'erreur
   */
  onSpeechResults = e => {
    const { partialResults, scores, whichEye, errorsInLine } = this.state;
    const newResults = [...e.value, ...partialResults];
    const [newScore, gotErrors] = this.getNewScore(newResults);
    console.log("onSpeechResults: ", newResults);
    this.setState(
      {
        results: newResults,
        scores: { ...scores, [whichEye]: newScore },
        errorsInLine: gotErrors ? errorsInLine + 1 : errorsInLine
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
    this.setState({ rec: true });
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
      this.setState({ rec: false });
      await Voice.stop();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  _cancelRecognizing = async () => {
    try {
      this.setState({ rec: false });
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
      console.error(e);
    }
    this.setState({
      rec: false,
      recognized: "",
      pitch: "",
      error: "",
      started: "",
      results: [],
      partialResults: [],
      end: ""
    });
  };

  // Demarre le premier test
  handleStartPressed() {
    this.setState(
      {
        hasStarted: true
      },
      () => this.setNextLetter()
    );
  }

  // Demarre le deuxieme test
  handlePause() {
    this.setState(
      prevState => ({
        isPaused: !prevState.isPaused
      }),
      () => {
        const { isPaused } = this.state;
        if (isPaused) this._destroyRecognizer();
        if (!isPaused) this.wrapRecognizer();
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
      wellPlaced,
      rec,
      speaking
    } = this.state;
    const { hasPressedStart, hasStarted, hasEnded, isPaused } = this.state;
    const { goBack } = this.props.navigation;
    return (
      <View style={styles.container}>
        {/* Affiche le micro d'ecoute ou non selon la reconnaissance vocale pendant le test */}
        {hasStarted && !hasEnded && !isPaused && (
          <Micro isRecognizing={rec && !speaking}></Micro>
        )}

        {/* Scanner a QR Code si le test n'est pas termine */}
        {!hasEnded && <HiddenQrCode onSuccess={this.onSuccess.bind(this)} />}

        {/* Affichage des instructions avant le premier test */}
        {!hasPressedStart && (
          <Instructions
            wellPlaced={wellPlaced}
            handleStartPressed={() => this.setState({ hasPressedStart: true })}
          />
        )}

        {/* Affichage du decompte avant le debut du test */}
        {!hasStarted && hasPressedStart && (
          <Countdown handler={this.handleStartPressed.bind(this)} />
        )}

        {/* Affichage des lettres lors du texte */}
        {hasStarted && !hasEnded && !isPaused && wellPlaced && (
          <Text style={{ fontFamily: "optician-sans", fontSize: lineSize }}>
            {letter}
          </Text>
        )}

        {/* Affichage des instructions avant le deuxieme test */}
        {isPaused && (
          <ChangeEye
            wellPlaced={wellPlaced}
            handlePause={this.handlePause.bind(this)}
          />
        )}

        {/* Affichage des indications de placement de l'utilisateur */}
        {!wellPlaced && (!hasPressedStart || hasStarted) && (
          <Text style={styles.indication}>{indication}</Text>
        )}

        {/* Affichage de fin du test */}
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

// Affichage du symbole du micro en écoute ou non selon la reconnaissance vocale
// isRecognizing : true si la reconnaissance ecoute
function Micro({ isRecognizing }) {
  return (
    <Image style={styles.micro} source={isRecognizing ? mic_on : mic_off} />
  );
}

// Scanner a QR Code cache
// onSuccess : fonction appelee si un QR Code est detecte
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

// Instructions precedent le test du premier oeil
// handleStartPressed : fonction appelee lors de l'appuie du bouton
// wellPlaced : true si l'utilisateur est bien place
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

// Instructions precedent le test du premier oeil
// handlePause : fonction appelee lors de l'appuie du bouton
// wellPlaced : true si l'utilisateur est bien place
function ChangeEye({ handlePause, wellPlaced }) {
  const [isCoutdownVisible, setIsCountdownVisible] = useState(false);
  return (
    <>
      {!isCoutdownVisible && (
        <>
          <Text style={common.headers}>Test de vision</Text>
          <Text style={common.important}>
            Nous allons évaluer votre{" "}
            <Text style={{ fontWeight: "bold" }}>œil droit</Text>. Veuillez
            enfiler les lunettes cachant votre{" "}
            <Text style={{ fontWeight: "bold" }}>œil gauche</Text>.
          </Text>
          <Text style={common.important}>
            Placez-vous confortablement et appuyez sur le bouton lorsque vous
            êtes prêt.
          </Text>
          {wellPlaced && (
            <TouchableOpacity
              style={styles.actionButtons}
              onPress={() => setIsCountdownVisible(true)}
            >
              <Text style={styles.actionButtonsText}>CONTINUER</Text>
            </TouchableOpacity>
          )}
        </>
      )}
      {isCoutdownVisible && <Countdown handler={handlePause} />}
    </>
  );
}

/**
 * Décompte avant le début du test et après la pause
 *
 * @param {Function} handler la fonction executée après la fin du décompte
 */
function Countdown({ handler }) {
  const [counter, setCounter] = useState(3);
  let intervalId;
  useEffect(() => {
    intervalId = setInterval(() => {
      setCounter(counter - 1);
    }, 1000);
    if (counter === 0) {
      clearInterval(intervalId);
      handler();
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [counter]);
  return counter > 0 ? <Text style={styles.countdown}>{counter}</Text> : null;
}

// Message de fin du test,
// scores : scores de chaque oeil
// targetLines : nombre de lignes du test
// handleOnEnd : fonction appelee lors de l'appuie sur le bouton
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
  indication: { fontSize: 30 },
  micro: {
    position: "absolute",
    bottom: "25%"
  }
});
