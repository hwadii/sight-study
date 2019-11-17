import React from "react";
import Card from "./Card";
import { ScrollView, StyleSheet, View } from "react-native";

// TODO: Change Settings Icon for higher res image.

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
    route: "Settings",
    title: "Modifiez vos réglages ⚙️",
    description: "Changez vos paramètres.",
    image: require("../assets/settings.png") 
  }
];

export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.props.navigation.navigate = this.props.navigation.navigate.bind(this);
  }

  render() {
    return (
      <ScrollView style={styles.cards}>
        <View style={styles.container}>
          <Cards navigate={this.props.navigation.navigate} />
        </View>
      </ScrollView>
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
    alignItems: "center"
  },
  cards: {
    width: "100%"
  }
});
