import React from "react";
import {
  AsyncStorage,
  StyleSheet,
  TouchableHighlight,
  Text,
  View
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import * as User from "./db/User";

const DATA = [
  "Aaren",
  "Aarika",
  "Abagael",
  "Abagail",
  "Abbe",
  "Abbey",
  "Abbi",
  "Abbie",
  "Abby",
  "Abbye",
  "Abigael",
  "Abigail",
  "Abigale",
  "Abra",
  "Ada",
  "Adah",
  "Adaline",
  "Adan",
  "Adara",
  "Adda",
  "Addi",
  "Addia",
  "Addie",
  "Addy",
  "Adel",
  "Adela",
  "Adelaida",
  "Adelaide",
  "Adele"
];

export default class SignIn extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
  }


  componentDidMount() {
    User.getUsers(users => {
      let users_t = []
      users.forEach(element => {
        users_t.push({
          id: element["id"],
          nom: element["nom"],
          prenom: element["prenom"],
          derniere_connexion: element["derniere_connexion"]
        })
      });
      this.setState({ users: users_t })
      console.log(this.state.users)
    })
  }

  render() {
    if (this.state.users.length == 0) {
      return (
        <View style={styles.container}>
          <View style={styles.noAccount}>
            <Text style={styles.noAccountText}>
              Pas de compte ?
            <Text
                onPress={() => this.props.navigation.navigate("SignUp")}
                style={{ fontWeight: "bold", color: "#007BFF" }}
              >
                Inscrivez-vous !
            </Text>
            </Text>
          </View>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <View style={styles.noAccount}>
          <Text style={styles.noAccountText}>
            Pas de compte ?
            <Text
              onPress={() => this.props.navigation.navigate("SignUp")}
              style={{ fontWeight: "bold", color: "#007BFF" }}
            >
              Inscrivez-vous !
            </Text>
          </Text>
          <Text style={styles.noAccountText}>
            test:
            <Text
              onPress={() => this.props.navigation.navigate("Score")}
              style={{ fontWeight: "bold", color: "#007BFF" }}
            >
              Score !
            </Text>
          </Text>
          <Text style={styles.noAccountText}>
            test:
            <Text
              onPress={() => this.props.navigation.navigate("TestScreen")}
              style={{ fontWeight: "bold", color: "#007BFF" }}
            >
              Screen!
            </Text>
          </Text>
        </View>
        <View style={styles.usersList}>
          <FlatList
            data={this.state.users}
            renderItem={({ item }) => (
              <User_view
                title={`${item["prenom"]} ${item["nom"]}`}
                lastConnected={item["derniere_connexion"]}
                props={this.props.navigation}
                id={item["id"]}
              />
            )}
            keyExtractor={item => Math.random().toString()}
          />
        </View>
      </View>
    );
  }
}

function User_view({ title, lastConnected, props, id }) {
  console.log(id)
  return (
    <TouchableHighlight
      onPress={() => {
        AsyncStorage.setItem("id", String(id));
        props.navigate("Score");

      }}
    >
      <View style={styles.userBox}>
        <Text style={styles.userText}>{title}</Text>
        <Text>Dernière connexion: {lastConnected}</Text>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    marginTop: 15
  },
  noAccount: {
    alignItems: "flex-end",
    padding: 5
  },
  noAccountText: {
    fontSize: 20
  },
  userBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    // borderBottomWidth: 0.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 10,
    padding: 18,
    paddingTop: 26,
    paddingBottom: 26
  },
  userText: {
    fontSize: 18,
    fontWeight: "bold"
    // textAlign: "center"
  },
  usersList: {
    // alignItems: "center"
  }
});
