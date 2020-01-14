import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles as common } from "./styles/common";
import { getFirstName, getLastName, getDoctorEmail,getDistance,getDecalage  } from "./util/util";
import * as User from "../service/db/User";
import { clear } from "./util/util";
import * as Speech from 'expo-speech';


export default class MainMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: null,
      lastName: null,
      doctorEmail: null,
      distance : null,
      decalage : null
    };
    this.props.navigation.addListener("willFocus", async () => {
      const userName = await Promise.all([getFirstName(), getLastName()]); // [firstName, lastName]
      const mail = await getDoctorEmail();
      const distance = await getDistance();
      const decalage = await getDecalage();
      this.setState({
        firstName: userName[0],
        lastName: userName[1],
        doctorEmail: mail,
        distance : distance,
        decalage : decalage
      });
    });
  }

  handleAction(action) {
    if (action === "REGLAGES") this.props.navigation.navigate("SetUser");
    if (action === "TEST") this.props.navigation.navigate("Menu");
  }

  render() {
    const { firstName, lastName, doctorEmail, distance, decalage } = this.state;
    return (
      <View style={common.containers}>
        <UserConnected firstName={firstName} lastName={lastName} />
        <DoctorMail email={doctorEmail} />
        <Settings distance={distance} decalage={decalage}/>
        {firstName === null || lastName === null ? null : (
          <TouchableOpacity
            style={common.actionButtons}
            onPress={() => this.handleAction("TEST")}
          >
            <Text style={common.actionButtonsText}>Aller au test</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={common.actionButtons}
          onPress={() => this.handleAction("REGLAGES")}
        >
          <Text style={common.actionButtonsText}>Réglages</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

function UserConnected({ firstName, lastName }) {
  const formattedUser = `${firstName} ${lastName}`;
  return (
    <View>
      {firstName === null && lastName === null ? (
        <Text style={common.important}>La tablette n'est pas configurée.</Text>
      ) : (
        <Text style={common.important}>
          Le patient <Text style={{ fontWeight: "bold" }}>{formattedUser}</Text>{" "}
          utilise la tablette.
        </Text>
      )}
    </View>
  );
}

function DoctorMail({ email }) {
  return (
    <View>
      {email ? (
        <Text style={common.important}>
          L'email du médecin est{" "}
          <Text style={{ fontWeight: "bold" }}>{email}</Text>.
        </Text>
      ) : (
        <Text style={common.important}>
          Le mail du médecin n'est pas configurée.
        </Text>
      )}
    </View>
  );
}

function Settings({ distance, decalage }) {
  return (
    <View>
      {distance? (
        <Text style={common.important}>
          La distance est {" "}
          <Text style={{ fontWeight: "bold" }}>{distance}</Text>.
        </Text>
      ) : (
        <Text style={common.important}>
          La distance n'est pas configurée.
        </Text>
      )}
      {decalage? (
        <Text style={common.important}>
          Le decalage est {" "}
          <Text style={{ fontWeight: "bold" }}>{decalage}</Text>.
        </Text>
      ) : (
        <Text style={common.important}>
          Le decalage n'est pas configurée.
        </Text>
      )}
    </View>
  );
}
