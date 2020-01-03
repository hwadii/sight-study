import React from "react";
import {
  StyleSheet,
  TextInput,
  TouchableHighlight,
  FlatList,
  Text,
  View
} from "react-native";
import * as User from "../service/db/User";
import { setId, setUserName } from "./util/util";
import { styles as common } from "./styles/common";

// TODO: Create Frequently used components?
// TODO: Modal when user has been changed?
// TODO: Sort options?
// TODO: Look into issue when many names.

export default class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
    this.props.navigation.addListener("willFocus", () => {
      User.getUsers(users => {
        this.setState({ users });
      });
    });
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(e) {
    User.getUsersLike(e.nativeEvent.text, users => {
      this.setState({ users });
    });
  }

  render() {
    const { users } = this.state;
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <NoAccount navigate={navigation.navigate} />
        <UsersList
          handleSearch={this.handleSearch}
          users={users}
          navigate={navigation.navigate}
        />
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
      <Text onPress={() => navigate("AddUser")} style={{...styles.noAccountText, ...styles.link}} >
        Ajouter un patient
      </Text>
    </View>
  );
}

/**
 * Search user in the list
 */
function SearchBar({ handleSearch }) {
  return (
    <TextInput
      style={{ marginHorizontal: 10, ...common.inputs }}
      placeholder="Rechercher un patient"
      onChange={handleSearch}
    />
  );
}

/**
 * List of users
 */
function UsersList({ users, navigate, handleSearch }) {
  return (
    <View style={styles.usersList}>
      <FlatList
        data={users}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={<SearchBar handleSearch={handleSearch} />}
        renderItem={({ item }) => (
          <UserElement
            id={item.id}
            user={{ prenom: item.prenom, nom: item.nom }}
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
function UserElement({ user, lastConnected, navigate, id }) {
  return (
    <TouchableHighlight
      onPress={async () => {
        await setId(id.toString());
        await setUserName(user);
        navigate("MainMenu");
      }}
    >
      <View style={styles.userBox}>
        <Text style={styles.userText}>
          {user.prenom} {user.nom}
        </Text>
        <Text>Dernière connexion: {lastConnected}</Text>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    marginBottom: 35
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
