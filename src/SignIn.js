import React from "react";
import {
  AsyncStorage,
  StyleSheet,
  TouchableHighlight,
  Text,
  View
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import * as User from "../service/db/User";

// TODO: Add intermediate page for entering PIN.
// TODO: Create Frequently used components.

export default class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
  }

  componentDidMount() {
    User.getUsers(users => {
      this.setState({ users });
    });
  }

  render() {
    const { users } = this.state;
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <NoAccount navigate={navigation.navigate} />
        {users.length > 0 && (
          <UsersList users={users} navigate={navigation.navigate} />
        )}
      </View>
    );
  }
}

/**
 * Displays a text to allow the user to go and create an account
 * if he doesn't have one
 */
function NoAccount({ navigate }) {
  return (
    <View style={styles.noAccount}>
      <Text style={styles.noAccountText}>
        Pas de compte ?
        <Text onPress={() => navigate("SignUp")} style={styles.link}>
          Inscrivez-vous !
        </Text>
      </Text>
      <Text onPress={() => navigate("Test")} style={styles.link}>
        Lien vers Test.js
      </Text>
    </View>
  );
}

/**
 * List of users
 */
function UsersList({ users, navigate }) {
  return (
    <View style={styles.usersList}>
      <FlatList
        data={users}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <UserElement
            id={item.id}
            title={`${item.prenom} ${item.nom}`}
            lastConnected={item.derniere_connexion}
            navigate={navigate}
          />
        )}
      />
    </View>
  );
}

/**
 * A row of the users list
 */
function UserElement({ title, lastConnected, navigate, id }) {
  return (
    <TouchableHighlight
      onPress={() => {
        AsyncStorage.setItem("id", String(id));
        navigate("Menu");
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
  },
  link: {
    fontWeight: "bold",
    color: "#007BFF"
  }
});
