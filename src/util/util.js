import { AsyncStorage } from "react-native";
import base64 from 'react-native-base64'

import * as User from "../../service/db/User";
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

async function setDistance(distance) {
  try {
    await AsyncStorage.setItem("distance", distance);
  } catch{
    console.log("Error setting distance");
  }
}

async function getDistance() {
  try {
    return await AsyncStorage.getItem("distance");
  } catch {
    console.log("Error getting distance");
  }
}

async function setDecalage(decalage) {
  try {
    await AsyncStorage.setItem("decalage", decalage);
  } catch{
    console.log("Error setting decalage");
  }
}

async function getDecalage() {
  try {
    return await AsyncStorage.getItem("decalage");
  } catch {
    console.log("Error getting decalage");
  }
}

async function sendmail(score){
  mail = await getDoctorEmail()
  firstname = await getFirstName()
  lastName = await getLastName()
  user = firstName + " " + lastName
  let headers = new Headers();
  headers.set('Authorization', 'Basic ' + base64.encode("0cfcb70e5789a15691fd433c4d75fc00" + ":" + "283db4b296ba835850b9fe6fd4ac8383"));
  headers.set('Content-Type', 'application/json');
  const rawResponse = await fetch('https://api.mailjet.com/v3.1/send', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      "Messages": [
        {
          "From": {
            "Email": "sightstudyapp@gmail.com",
            "Name": "Sight Study"
          },
          "To": [
            {
              "Email": mail,
              "Name": "Medecin"
            }
          ],
          "Subject": "Résultats de "+user,
          "HTMLPart": "Le patient"+ user +"vient d'obtenir le score de <b>"+score+"</b>.",
        }
      ]
    })
  });
  const content = await rawResponse.json();

}

//user= id, 
async function sendmailresults(id_user,nom,prenom) {
  mail = await getDoctorEmail()
  User.getScore(id_user,async (score)=>{
    let csvContent = "date;oeil_droit;oeil_gauche \r\n";
          console.log(score)
          score.forEach(function(rowArray) {

            csvContent += rowArray["date"] +";"+rowArray["oeil_droit"]+";"+rowArray["oeil_gauche"] +"\r\n";
        });
    
    let headers = new Headers();
    headers.set('Authorization', 'Basic ' + base64.encode("0cfcb70e5789a15691fd433c4d75fc00" + ":" + "283db4b296ba835850b9fe6fd4ac8383"));
    headers.set('Content-Type', 'application/json');
    const rawResponse = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        "Messages": [
          {
            "From": {
              "Email": "sightstudyapp@gmail.com",
              "Name": "Sight Study"
            },
            "To": [
              {
                "Email": mail,
                "Name": "Medecin"
              }
            ],
            "Subject": "Résultats de "+nom+ " "+ prenom,
            "HTMLPart": "Voici tous les resultats de "+nom+ " "+ prenom + ".",
            "Attachments": [
              {
                  "ContentType": "application/CSV",
                  "Filename": nom+ "_"+ prenom+".csv",
                  "Base64Content": base64.encode(csvContent)
              }
          ]
          }
        ]
      })
    });
    const content = await rawResponse.json();
  
    console.log(content);
  })

}

export {
  getId,
  setId,
  clear,
  setUserName,
  getFirstName,
  getLastName,
  setDoctorEmail,
  getDoctorEmail,
  setDistance,
  getDistance,
  setDecalage,
  getDecalage,
  sendmail,
  sendmailresults
};
