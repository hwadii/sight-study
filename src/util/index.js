import { AsyncStorage, Alert } from "react-native";
import base64 from "./base64";
import { format, parseISO } from "date-fns";
import {
  getUser as getUserFromDb,
  getScore,
  getIds,
  getScores
} from "../../service/db/User";

// Constants
export const defaultEtdrsScale = {
  "4/40": 0.1,
  "4/32": 0.13,
  "4/25": 0.16,
  "4/20": 0.2,
  "4/16": 0.25,
  "4/12.5": 0.32,
  "4/10": 0.4,
  "4/8": 0.5,
  "4/6.3": 0.63,
  "4/5": 0.8,
  "4/4": 1,
  "3/4": 1.33
};

const defaultTargetLines = "5";

const defaultQrSize = "3";

// General
/**
 * Returns formatted date
 * @param {Date} date a date
 * @returns {string} the formatted date in the specified format
 */
export const formatDate = date => format(date, "dd/MM/yyyy");

export async function initDefault() {
  const targetLines = await getTargetLines();
  const qrSize = await getQrSize();
  const etdrsScale = await getAcuites();
  const mail = await getDoctorEmail();
  if (targetLines === null) await setTargetLines(defaultTargetLines);
  if (qrSize === null) await setQrSize(defaultQrSize);
  if (etdrsScale === null) await setAcuites(defaultEtdrsScale);
  if (mail === null) await setDoctorEmail("");
}

/**
 * Shows alert
 *
 * @param {string} message the message of the alert.
 * @param {Function} onPress function called when Ok is pressed
 * @param {string} title the title of the alert
 * @param {Array} moreButtons more buttons if needed
 */
export function showAlert(
  message,
  onPress,
  moreButtons = [],
  title = "Configuration de la tablette"
) {
  Alert.alert(title, message, [
    ...moreButtons,
    {
      text: "OK",
      onPress
    }
  ]);
}

// AsyncStorage
const lettersDict = {
  n: ["n", "N", "Aisne", "haine", "and", "elle", "m", "M"],
  c: ["c'est", "C'est", "C", "c", "se", "s'est", "seth"],
  k: [
    "cas",
    "K",
    "caca",
    "CAC",
    "K",
    "quoi",
    "quand",
    "Quoi",
    "Quand",
    "corps",
    "cours",
    "a quoi",
    "coi",
    "COS",
    "co",
    "coco",
    "car",
    "carte",
    "cars",
    "Car",
    "Cars",
    "Cahors"
  ],
  z: ["z", "Z", "Zed", "Zedd", "ZI", "dead", "zèbre", "YZ"],
  o: ["Oh", "eau", "au", "oh", "o", "O"],
  r: ["air", "Air", "R", "aire", "r"],
  h: ["H", "h", "Ash", "hache", "ash", "âge"],
  s: ["s", "S", "est-ce", "Ace", "où est-ce"],
  d: ["2", "de", "dès", "D", "d", "Dès", "b", "B", "bébé", "des", "the", "The"],
  v: ["v", "V", "vais", "je vais", "VV"]
};

// TODO: le faire en bon js...
export function intersection(array, letter) {
  for (const el of array) {
    if (lettersDict[letter].includes(el)) {
      return true;
    }
  }
  return false;
}

/**
 * Set current user name
 */
export async function setUserName({ prenom: firstName, nom: lastName }) {
  try {
    await AsyncStorage.multiSet([
      ["firstName", firstName],
      ["lastName", lastName]
    ]);
  } catch (error) {
    console.log(error);
  }
}

/**
 * Get user's first name
 */
export async function getFirstName() {
  try {
    const firstName = await AsyncStorage.getItem("firstName");
    return firstName;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Get user's last name
 */
export async function getLastName() {
  try {
    const lastName = await AsyncStorage.getItem("lastName");
    return lastName;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Gets user's full name
 */
export async function getFullName() {
  try {
    const fullName = await Promise.all([getFirstName(), getLastName()]);
    const userInDb = await getUserFromDb(fullName[1], fullName[0]);
    if (userInDb !== null) return fullName.join(" ");
    else {
      await AsyncStorage.multiRemove(["firstName", "lastName"]);
      return null;
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * Set user id in AsyncStorage
 */
export async function setId(id) {
  try {
    return await AsyncStorage.setItem("id", id);
  } catch (error) {
    console.log(error);
  }
}

/**
 * Get user id from AsyncStorage.
 */
export async function getId() {
  try {
    const value = await AsyncStorage.getItem("id");
    if (value !== null) {
      return parseInt(value);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function clear() {
  try {
    return await AsyncStorage.clear();
  } catch {
    console.log("Unable to clear storage");
  }
}

export async function setDoctorEmail(email) {
  try {
    return await AsyncStorage.setItem("doctor_email", email);
  } catch {
    console.log("Error setting email");
  }
}

export async function getDoctorEmail() {
  try {
    return await AsyncStorage.getItem("doctor_email");
  } catch {
    console.log("Error getting email");
  }
}

export async function setAdminPin(pin) {
  try {
    return await AsyncStorage.setItem("admin_pin", pin);
  } catch {
    console.log("Error setting pin");
  }
}

export async function getAdminPin() {
  try {
    return await AsyncStorage.getItem("admin_pin");
  } catch {
    console.log("Error getting pin");
  }
}

export async function setTargetLines(targetLines) {
  try {
    return await AsyncStorage.setItem("target_lines", targetLines);
  } catch {
    console.log("Error setting target lines");
  }
}

export async function getTargetLines() {
  try {
    const targetLines = await AsyncStorage.getItem("target_lines");
    if (targetLines !== null) return parseInt(targetLines);
    return targetLines;
  } catch {
    console.log("Error getting target lines");
  }
}

export async function setQrSize(qrSize) {
  try {
    return await AsyncStorage.setItem("qrsize", qrSize);
  } catch {
    console.log("Error setting QR size");
  }
}

export async function getQrSize() {
  try {
    const qrSize = await AsyncStorage.getItem("qrsize");
    if (qrSize !== null) return parseFloat(qrSize);
    return qrSize;
  } catch {
    console.log("Error getting QR size");
  }
}

export async function setVolume(volume) {
  try {
    return await AsyncStorage.setItem("volume", volume);
  } catch {
    console.log("Error setting volume");
  }
}

async function _getVolume() {
  try {
    const newVolume = await AsyncStorage.getItem("volume");
    return parseFloat(newVolume);
  } catch {
    console.log("Error getting volume");
  }
}

export async function setBrightness(brightness) {
  try {
    return await AsyncStorage.setItem("brightness", brightness);
  } catch {
    console.log("Error setting brightness");
  }
}

export async function getAllSettings() {
  try {
    return {
      volume: await _getVolume(),
      brightness: await _getBrightness(),
      mail: await getDoctorEmail(),
      pin: await getAdminPin(),
      targetLines: await getTargetLines(),
      qrsize: await getQrSize()
    };
  } catch {
    console.log("Error getting all settings");
  }
}

async function _getBrightness() {
  try {
    const newBrightness = await AsyncStorage.getItem("brightness");
    return parseFloat(newBrightness);
  } catch {
    console.log("Error getting brightness");
  }
}

const mailApi = "https://api.mailjet.com/v3.1/send";
const headers = _createHeaders();

function _createHeaders() {
  const headers = new Headers();
  headers.set(
    "Authorization",
    "Basic " +
      base64.encode(
        "0cfcb70e5789a15691fd433c4d75fc00" +
          ":" +
          "283db4b296ba835850b9fe6fd4ac8383"
      )
  );
  headers.set("Content-Type", "application/json");
  return headers;
}

// TODO: check if results did not get sent.
async function _send(message) {
  const rawResponse = await fetch(mailApi, {
    method: "POST",
    headers,
    body: message
  });
  return rawResponse.json();
}

function _createAttachement(fileName, CSVContent) {
  if (!CSVContent) return [];
  return [
    {
      ContentType: "text/csv",
      Filename: `${fileName}.csv`,
      Base64Content: base64.encode(CSVContent)
    }
  ];
}

async function _createMessage(
  Subject,
  HTMLPart,
  CSVContent = "",
  fileName = ""
) {
  const to = await getDoctorEmail();
  const message = {
    Messages: [
      {
        From: {
          Email: "sightstudyapp@gmail.com",
          Name: "Sight Study"
        },
        To: [
          {
            Email: to,
            Name: "Médecin"
          }
        ],
        Subject,
        HTMLPart,
        Attachments: _createAttachement(fileName, CSVContent)
      }
    ]
  };
  return JSON.stringify(message);
}

export async function sendWarningEmail(score) {
  const name = await getFullName();
  const message = await _createMessage(
    `Résultats de ${name}`,
    `Le patient ${name} vient d'obtenir le score de <b>${score}/50</b>.`
  );
  return _send(message);
}

function _buildCsvOne(scores) {
  let csvContent = "Date,Oeil droit,Oeil gauche\r\n";
  for (const row of scores) {
    const { date, oeil_droit, oeil_gauche } = row;
    csvContent += `${formatDate(
      parseISO(date)
    )},${oeil_droit},${oeil_gauche}\r\n`;
  }
  return csvContent;
}

function _buildCsvAll(scores) {
  let csvContent = "Patient,Oeil droit,Oeil gauche,Date\r\n";
  for (const row of scores) {
    const { nom, prenom, oeil_droit, oeil_gauche, date } = row;
    csvContent += `${prenom} ${nom},${oeil_droit},${oeil_gauche},${formatDate(
      parseISO(date)
    )}\r\n`;
  }
  console.log(csvContent);
  return csvContent;
}

export async function setAcuites(acuites) {
  try {
    return await AsyncStorage.setItem("acuites", JSON.stringify(acuites));
  } catch {
    console.log("Error setting acuites");
  }
}

export async function getAcuites() {
  try {
    return JSON.parse(await AsyncStorage.getItem("acuites"));
  } catch {
    console.log("Error getting acuites");
  }
}

export async function sendSelectedUserResults(userId, fullName) {
  const scoresObtained = await getScore(userId);
  const csvToSend = _buildCsvOne(scoresObtained);
  const fileName = fullName.split(" ").join("");
  const messageToSend = await _createMessage(
    `Résultats de ${fullName}`,
    `Voici tous les résultats de ${fullName}.`,
    csvToSend,
    fileName
  );
  return _send(messageToSend);
}

// TODO: le csv doit former autant d'entetes que necessaire
export async function sendAllUsersResults() {
  const allScores = await getScores();
  const csvToSend = _buildCsvAll(allScores);
  const messageToSend = await _createMessage(
    `Tous les résultats`,
    `Voici les résultats de tous les utilisateurs.`,
    csvToSend,
    "tous-les-resultats"
  );
  return _send(messageToSend);
}

export async function checkScoreAndSend(callback) {
  const currentUserId = await getId();
  const score = await getScore();
}
