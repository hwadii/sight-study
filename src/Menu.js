import React from "react";
import Card from "./Card";
import { Text, StyleSheet, View, Button, Linking } from "react-native";
import { styles as common } from "./styles/common";
import { getFirstName, sendMail } from "./util";
import Help from "./Help";

const texts = [
  {
    id: 1,
    route: "Test",
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
          <Button onPress={async () => sendMail(40)} title="mail 3" />
          <Text style={{ ...common.headers, fontWeight: "normal" }}>
            Bonjour,{" "}
            <Text style={{ fontStyle: "italic", fontWeight: "bold" }}>
              {firstName}
            </Text>{" "}
            !
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
  return texts.map(text => (
    <Card
      key={text.id}
      title={text.title}
      description={text.description}
      route={text.route}
      navigate={navigate}
      image={text.image}
    />
  ));
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
    justifyContent: "center",
    margin: 10
  }
});
