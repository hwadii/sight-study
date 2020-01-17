import { AsyncStorage } from "react-native";
import base64 from "./base64";
import { getUser as getUserFromDb } from "../../service/db/User";

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

export function intersection(array, letter) {
  console.log(letter);
  // console.log(array);
  for (let el of array) {
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
    await AsyncStorage.setItem("id", id);
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
    await AsyncStorage.clear();
  } catch {
    console.log("Unable to clear storage");
  }
}

export async function setDoctorEmail(email) {
  try {
    await AsyncStorage.setItem("doctor_email", email);
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
    await AsyncStorage.setItem("distance", distance);
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
    await AsyncStorage.setItem("decalage", decalage);
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

export async function sendMail(score) {
  const to = await getDoctorEmail();
  let name = await getFullName();
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
  const rawResponse = await fetch("https://api.mailjet.com/v3.1/send", {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      Messages: [
        {
          From: {
            Email: "sightstudyapp@gmail.com",
            Name: "Sight Study"
          },
          To: [
            {
              Email: to,
              Name: name
            }
          ],
          Subject: `Résultats de ${name}`,
          HTMLPart: `Le patient ${name} vient d'obtenir le score de <b>${score}/50</b>.`
        }
      ]
    })
  });
  return rawResponse.json();
}
