import React from "react";
import Card from "./Card";
import { Text, StyleSheet, View, Button, Linking } from "react-native";
import { styles as common } from "./styles/common";
import { getFirstName, sendmail, sendmailresults,sendmailallresults } from "./util/util";
import * as Speech from 'expo-speech';

import * as User from "../service/db/User";

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
  }
];

export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    //User.addScore(1,2,3,()=>console.log("ok"))
    //User.addScore(1,6,10,()=>console.log("ok"))
    //Speech.speak("Vous êtes sur votre compte", {language:"fr"})
    //Speech.speak("Pour commencer le test appuyer sur l'icone de gauche", {language:"fr"})
    //Speech.speak("Pour consulter vos résultats appuyer sur l'icone de droite", {language:"fr"})
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
          <Button onPress={async () => {
            sendmailresults(1, "adam", "colas")
          }
          } title="mail 3 " />
          <Button onPress={async () => {
            sendmailallresults()
          }
          } title="all mail " />
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
