import { AsyncStorage } from "react-native"
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

export default { getId, setUserType, getUserType }
