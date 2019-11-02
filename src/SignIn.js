import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

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
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.noAccount}>
          <Text style={styles.noAccountText}>
            Pas de compte ?{" "}
            <Text
              onPress={() => this.props.navigation.navigate("SignUp")}
              style={{ fontWeight: "bold", color: "#007BFF" }}
            >
              Inscrivez-vous !
            </Text>
          </Text>
        </View>
        <View style={styles.usersList}>
          <FlatList
            data={DATA}
            renderItem={({ item }) => (
              <User
                title={`${item} Last name`}
                lastConnected={new Date().toLocaleDateString()}
              />
            )}
            keyExtractor={item => Math.random().toString()}
          />
        </View>
      </View>
    );
  }
}

function User({ title, lastConnected }) {
  return (
    <View style={styles.userBox}>
      <Text style={styles.userText}>{title}</Text>
      <Text>Dernière connexion: {lastConnected}</Text>
    </View>
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
    fontSize: 20,
  },
  userBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    // borderBottomWidth: 0.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 10,
    padding: 18,
    paddingTop: 26,
    paddingBottom: 26,
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
