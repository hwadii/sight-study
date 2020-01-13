import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles as common } from "./styles/common";
import { getFullName, getDoctorEmail } from "./util/util";
import * as User from "../service/db/User";
import { clear } from "./util/util";
import * as Speech from "expo-speech";

export default class MainMenu extends React.Component {
  constructor(props) {
    super(props);
    // Speech.speak("Bienvenue sur l'application Sight Study", {language:"fr"})
    this.state = {
      fullName: null,
      doctorEmail: null
    };
    this.props.navigation.addListener("willFocus", async () => {
      const userName = await getFullName();
      const mail = await getDoctorEmail();
      this.setState({
        fullName: userName,
        doctorEmail: mail
      });
    });
  }

  handleAction(action) {
    if (action === "REGLAGES") this.props.navigation.navigate("SetUser");
    if (action === "TEST") this.props.navigation.navigate("Menu");
  }

  render() {
    const { fullName, doctorEmail } = this.state;
    return (
      <View style={common.containers}>
        <UserConnected fullName={fullName} />
        <DoctorMail email={doctorEmail} />
        {fullName === null ? null : (
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

function UserConnected({ fullName }) {
  return (
    <View>
      {fullName === null ? (
        <Text style={common.important}>La tablette n'est pas configurée.</Text>
      ) : (
        <Text style={common.important}>
          Le patient <Text style={{ fontWeight: "bold" }}>{fullName}</Text>{" "}
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
