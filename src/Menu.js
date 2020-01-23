import React from "react";
import Card from "./Card";
import { Text, StyleSheet, View, ActivityIndicator } from "react-native";
import { styles as common } from "./styles/common";
import { clear, getFullName, getDoctorEmail } from "./util";
import Help from "./Help";

const texts = [
  {
    id: 1,
    route: "TestScreen",
    title: "Commencer le test 📝",
    description:
      "Vous allez devoir lire les lettres affichées à l’écran. Veuillez vous installez dans une pièce sombre et silencieuse.",
    image: require("../assets/racing-flag.png")
  },
  {
    id: 2,
    route: "Score",
    title: "Suivez vos résultats 📈",
    description:
      "Vous pouvez suivre l’évolution de vos résultats au fil du temps ici.",
    image: require("../assets/diagram.png")
  },
  {
    id: 3,
    route: "SetUser",
    title: "",
    description: "",
    image: require("../assets/settings.png")
  }
];

export default class Menu extends React.Component {
  static navigationOptions = {
    headerRight: () => <Help />
  };
  constructor(props) {
    super(props);
    this.state = {
      fullName: null,
      doctorEmail: null,
      isLoaded: false
    };
    this.props.navigation.navigate = this.props.navigation.navigate.bind(this);
  }

  async componentDidMount() {
    await this.getLoggedState();
    this.willFocusSub = this.props.navigation.addListener(
      "willFocus",
      async () => {
        await this.getLoggedState();
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSub.remove();
  }

  async getLoggedState() {
    this.setState({
      fullName: await getFullName(),
      doctorEmail: await getDoctorEmail(),
      isLoaded: true
    });
  }

  render() {
    const { fullName, doctorEmail, isLoaded } = this.state;
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.greetings}>
          {isLoaded ? (
            <>
              <UserConnected fullName={fullName} />
              <DoctorMail email={doctorEmail} />
            </>
          ) : (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
        </View>
        <View style={styles.cards}>
          <Cards navigate={navigate} />
        </View>
      </View>
    );
  }
}

function Cards({ navigate }) {
  const [start, scores, params] = texts;
  return (
    <>
      <>
        <Card
          title={start.title}
          description={start.description}
          route={start.route}
          navigate={navigate}
          image={start.image}
        />
      </>
      <View style={styles.rightSide}>
        <Card
          title={scores.title}
          description={scores.description}
          route={scores.route}
          navigate={navigate}
          image={scores.image}
        />
        <Card
          title={params.title}
          description={params.description}
          route={params.route}
          navigate={navigate}
          image={params.image}
          style="settings"
        />
      </View>
    </>
  );
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
  container: {
    flex: 1,
    flexDirection: "column"
  },
  greetings: {
    alignItems: "center",
    marginVertical: 5
  },
  cards: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center"
  },
  rightSide: {
    maxWidth: 250
  }
});
