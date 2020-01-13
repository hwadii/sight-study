import React from "react";
import Card from "./Card";
import { Text, StyleSheet, View, Button, Linking } from "react-native";
import { styles as common } from "./styles/common";
import { getFirstName } from "./util/util";
import * as Speech from 'expo-speech';
import base64 from 'react-native-base64'

import Communications from 'react-native-communications';

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

  async sendmail() {
    let headers = new Headers();
          headers.set('Authorization', 'Basic ' + base64.encode("0cfcb70e5789a15691fd433c4d75fc00"+ ":" + "283db4b296ba835850b9fe6fd4ac8383"));
          headers.set('Content-Type', 'application/json');
const rawResponse = await fetch('https://api.mailjet.com/v3.1/send', {
  method: 'POST',
  headers: headers,
  body: JSON.stringify({
  "Messages": [
    {
      "From": {
        "Email": "sightstudyapp@gmail.com",
        "Name": "Sight Study"
      },
      "To": [
        {
          "Email": "colas.adam@gmail.com",
		   "Name": "passenger 1"
        }
      ],
      "Subject": "Résultats de adam",
      "HTMLPart": "Le patient ${name} vient d'obtenir le score de <b>${score}</b>."
    }
  ]
})
});
const content = await rawResponse.json();

  console.log(content);
  }

  render() {
    const { firstName } = this.state;
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.greetings}>
       <Button onPress={ async() => {this.sendmail()}         
      } title ="mail 3 " />
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
