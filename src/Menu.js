import React from "react";
import Card from "./Card";
import { Text, StyleSheet, View, Button } from "react-native";
import { styles as common } from "./styles/common";
import { getFirstName, clear } from "./util";
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
      firstName: ""
    };
    this.props.navigation.navigate = this.props.navigation.navigate.bind(this);
  }

  async componentDidMount() {
    const firstName = await getFirstName();
    this.setState({ firstName });
  }

  render() {
    const { firstName } = this.state;
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.greetings}>
          <Text style={{ ...common.headers, fontWeight: "normal" }}>
            {firstName ? (
              <>
                Bonjour,{" "}
                <Text style={{ fontStyle: "italic", fontWeight: "bold" }}>
                  {firstName}
                </Text>{" "}
                !
              </>
            ) : (
              <Text>Aucun patient n'est configuré.</Text>
            )}
          </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  greetings: {
    alignItems: "center"
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
