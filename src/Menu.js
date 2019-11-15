import React from "react";
import Card from "./Card";
import { StyleSheet, Text, View } from "react-native";

const texts = [
  {
    id: 1,
    route: "Test",
    title: "Commencer le test 📝",
    description:
      "Vous allez devoir lire les lettres affichées à l’écran. Veuillez vous installez dans une pièce sombre et silencieuse."
  },
  {
    id: 2,
    route: "Score",
    title: "Suivez vos résultats 📈",
    description:
      "Vous pouvez suivre l’évolution de vos résultats au fil du temps ici."
  },
  {
    id: 3,
    route: "Settings",
    title: "Modifiez vos réglages ⚙️",
    description: "Changez vos paramètres."
  }
];

export default class Menu extends React.Component {
  render() {
    return (
      <View style={styles.cards}>
        <Cards navigate={this.props.navigation.navigate} />
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
    />
  ));
}

const styles = StyleSheet.create({
  cards: {
    display: "flex",
    marginHorizontal: "1rem",
    marginVertical: "1rem",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
});
