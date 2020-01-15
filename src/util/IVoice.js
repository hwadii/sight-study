import Voice from "react-native-voice";

function init() {
  Voice.onSpeechStart = onSpeechStart;
  Voice.onSpeechRecognized = onSpeechRecognized;
  Voice.onSpeechEnd = onSpeechEnd;
  Voice.onSpeechError = onSpeechError;
  Voice.onSpeechResults = onSpeechResults;
  Voice.onSpeechPartialResults = onSpeechPartialResults;
  Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;
}

function destroy() {
  Voice.destroy().then(Voice.removeAllListeners);
}

function onSpeechStart(e) {
  console.log("=== Started ===");
}

function onSpeechRecognized(e) {
  console.log("=== Recognized ===");
}

function onSpeechEnd(e) {
  console.log("=== End ===");
}

function onSpeechError(e) {}

function onSpeechResults(e) {}

function onSpeechPartialResults(e) {}

function onSpeechVolumeChanged(e) {}

async function _startRecognizing(callback) {
  callback();
  try {
    await Voice.start("fr-FR");
  } catch (e) {
    console.error(e);
  }
}

async function _stopRecognizing() {
  try {
    await Voice.stop();
  } catch (e) {
    console.error(e);
  }
}

async function _cancelRecognizing() {
  try {
    await Voice.cancel();
  } catch (e) {
    console.error(e);
  }
}

async function _destroyRecognizer(callback) {
  try {
    await Voice.destroy();
    console.log("Recognizer destroyed");
  } catch (e) {
    console.error(e);
  }
  callback();
}

export default {
  init,
  destroy,
  _startRecognizing,
  _stopRecognizing,
  _cancelRecognizing,
  _destroyRecognizer
};

export { Voice };
