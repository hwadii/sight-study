import { AsyncStorage } from "react-native";

/**
 * Set current user name
 */
async function setUserName({ prenom: firstName, nom: lastName }) {
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
async function getFirstName() {
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
async function getLastName() {
  try {
    const lastName = await AsyncStorage.getItem("lastName");
    return lastName;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Set current user type in Async Storage
 */
async function setUserType(type, callback) {
  try {
    await AsyncStorage.setItem("userType", type, callback);
  } catch (error) {
    console.log(error);
  }
}

/**
 * Get current user type from Async Storage
 */
async function getUserType() {
  try {
    const userType = await AsyncStorage.getItem("userType");
    return userType;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Set user id in AsyncStorage
 */
async function setId(id) {
  try {
    await AsyncStorage.setItem("id", id);
  } catch (error) {
    console.log(error);
  }
}

/**
 * Get user id from AsyncStorage.
 */
async function getId() {
  try {
    const value = await AsyncStorage.getItem("id");
    if (value !== null) {
      return value;
    }
  } catch (error) {
    console.log(error);
  }
}

async function clear() {
  try {
    await AsyncStorage.clear();
  } catch {
    console.log("Unable to clear storage");
  }
}

async function setDoctorEmail(email) {
  try {
    await AsyncStorage.setItem("doctor_email", email);
  } catch {
    console.log("Error setting email");
  }
}

async function getDoctorEmail() {
  try {
    return await AsyncStorage.getItem("doctor_email");
  } catch {
    console.log("Error getting email");
  }
}

export {
  getId,
  setId,
  clear,
  setUserType,
  getUserType,
  setUserName,
  getFirstName,
  getLastName,
  setDoctorEmail,
  getDoctorEmail
};
