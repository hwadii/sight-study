import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles as common } from "./styles/common";
import { getFullName, getDoctorEmail} from "./util";
import Help from "./Help";

export default class MainMenu extends React.Component {
  static navigationOptions = {
    headerRight: () => <Help />
  };
  constructor(props) {
    super(props);
    this.state = {
      fullName: null,
      doctorEmail: null,
      distance: null,
      tolerance: null
    };
  }

  handleAction(action) {
    if (action === "REGLAGES") this.props.navigation.navigate("SetUser");
    if (action === "TEST") this.props.navigation.navigate("Menu");
  }

  componentDidMount() {
    this.willFocusSub = this.props.navigation.addListener(
      "willFocus",
      async () => {
        this.setState({
          fullName: await getFullName(),
          doctorEmail: await getDoctorEmail(),
          // distance: await getDistance(),
          // tolerance: await getTolerance()
        });
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSub.remove();
  }

  render() {
    const { fullName, doctorEmail, distance, tolerance } = this.state;
    return (
      <View style={common.containers}>
        <UserConnected fullName={fullName} />
        <DoctorMail email={doctorEmail} />
        <Settings distance={distance} tolerance={tolerance} />
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

function Settings({ distance, tolerance }) {
  return (
    <View>
      {distance ? (
        <Text style={common.important}>
          La distance est <Text style={{ fontWeight: "bold" }}>{distance}</Text>
          .
        </Text>
      ) : (
        <Text style={common.important}>La distance n'est pas configurée.</Text>
      )}
      {tolerance ? (
        <Text style={common.important}>
          Le tolerance est <Text style={{ fontWeight: "bold" }}>{tolerance}</Text>
          .
        </Text>
      ) : (
        <Text style={common.important}>La tolerance n'est pas configurée.</Text>
      )}
    </View>
  );
}
