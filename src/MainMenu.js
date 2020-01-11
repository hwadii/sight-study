import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles as common } from "./styles/common";
import { getFirstName, getLastName, getDoctorEmail } from "./util/util";
import * as User from "../service/db/User";
import { clear } from "./util/util";

export default class MainMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: null,
      lastName: null,
      doctorEmail: null
    };
    this.props.navigation.addListener("willFocus", async () => {
      const userName = await Promise.all([getFirstName(), getLastName()]); // [firstName, lastName]
      const mail = await getDoctorEmail();
      this.setState({
        firstName: userName[0],
        lastName: userName[1],
        doctorEmail: mail
      });
    });
  }

  handleAction(action) {
    if (action === "REGLAGES") this.props.navigation.navigate("SetUser");
    if (action === "TEST") this.props.navigation.navigate("Menu");
  }

  render() {
    const { firstName, lastName, doctorEmail } = this.state;
    return (
      <View style={common.containers}>
        <UserConnected firstName={firstName} lastName={lastName} />
        <DoctorMail email={doctorEmail} />
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
