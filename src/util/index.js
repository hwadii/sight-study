import { AsyncStorage, Alert } from "react-native";
import base64 from "./base64";
import { format } from "date-fns";
import {
  getUser as getUserFromDb,
  getScore,
  getIds,
  getScores
} from "../../service/db/User";

// General
/**
 * Returns formatted date
 * @param {Date} date a date
 * @returns {string} the formatted date in the specified format
 */
export const formatDate = date => format(date, "dd/MM/yyyy");

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
/**
 * Set current user name
 */
export async function setUserName({ prenom: firstName, nom: lastName }) {
  try {
    await AsyncStorage.setItem("firstName", firstName);
    await AsyncStorage.setItem("lastName", lastName);
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

export async function setDistance(distance) {
  try {
    return await AsyncStorage.setItem("distance", distance);
  } catch {
    console.log("Error setting distance");
  }
}

export async function getDistance() {
  try {
    return await AsyncStorage.getItem("distance");
  } catch {
    console.log("Error getting distance");
  }
}

export async function setTolerance(decalage) {
  try {
    return await AsyncStorage.setItem("decalage", decalage);
  } catch {
    console.log("Error setting decalage");
  }
}

export async function getTolerance() {
  try {
    return await AsyncStorage.getItem("decalage");
  } catch {
    console.log("Error getting decalage");
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
    csvContent += `${date},${oeil_droit},${oeil_gauche}\r\n`;
  }
  return csvContent;
}

function _buildCsvAll(scores) {
  let csvContent = "Patient,Oeil droit,Oeil gauche,Date\r\n";
  for (const row of scores) {
    const { nom, prenom, oeil_droit, oeil_gauche, date } = row;
    csvContent += `${prenom} ${nom},${oeil_droit},${oeil_gauche},${date}\r\n`;
  }
  console.log(csvContent);
  return csvContent;
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
