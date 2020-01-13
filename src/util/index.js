import { AsyncStorage } from "react-native";
import { getUser as getUserFromDb } from "../../service/db/User";

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
