import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from "react-native";
import { styles as common } from "./styles/common";
import {
  getFullName,
  getDoctorEmail,
  setAcuites,
  getAcuites,
  defaultEtdrsScale
} from "./util";
import Help from "./Help";

export default class MainMenu extends React.Component {
  static navigationOptions = {
    headerRight: () => <Help />
  };
  constructor(props) {
    super(props);
    this.state = {
      fullName: null,
      doctorEmail: null
    };
  }

  handleAction(action) {
    if (action === "REGLAGES") this.props.navigation.navigate("SetUser");
    if (action === "TEST") this.props.navigation.navigate("Menu");
  }

  async componentDidMount() {
    const tableau = await getAcuites();
    if (tableau === null) {
      await setAcuites(defaultEtdrsScale);
    }
    this.willFocusSub = this.props.navigation.addListener(
      "willFocus",
      async () => {
        this.setState({
          fullName: await getFullName(),
          doctorEmail: await getDoctorEmail()
        });
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSub.remove();
  }

  render() {
    const { fullName, doctorEmail } = this.state;
    return (
      <View style={common.containers}>
        <UserConnected fullName={fullName} />
        <DoctorMail email={doctorEmail} />
        {fullName === null ? null : (
          <TouchableOpacity
            style={styles.actionButtons}
            onPress={() => this.handleAction("TEST")}
          >
            <Text style={common.actionButtonsText}>Aller au test</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.actionButtons}
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

const styles = StyleSheet.create({
  actionButtons: {
    ...common.actionButtons,
    maxWidth:
      Dimensions.get("window").width < 400
        ? Dimensions.get("window").width
        : 400
  }
});
