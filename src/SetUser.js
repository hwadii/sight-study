import React from "react";
import {
  StyleSheet,
  TextInput,
  FlatList,
  Button,
  Text,
  View,
  Alert
} from "react-native";
import * as User from "../service/db/User";
import { setId, setUserName } from "./util/util";
import { styles as common, colors } from "./styles/common";

// TODO: Create Frequently used components?
// TODO: Modal when user has been changed?
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
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSearch(e) {
    User.getUsersLike(e.nativeEvent.text, users => {
      this.setState({ users });
    });
  }

  async handleSelect(id, user) {
    await setId(id.toString());
    await setUserName(user);
    Alert.alert(
      "Configuration de la tablette",
      `La tablette est configurée pour ${user.prenom} ${user.nom}.`,
      [
        {
          text: "OK",
          onPress: () => this.props.navigation.navigate("MainMenu")
        }
      ]
    );
  }

  handleDelete(id, user) {
    const { users: oldUsersList } = this.state;
    Alert.alert(
      "Configuration de la tablette",
      `Le patient ${user.prenom} ${user.nom} va être supprimé.`,
      [
        {
          text: "Annuler"
        },
        {
          text: "OK",
          onPress: () =>
            User.removeUser(id, () => {
              this.setState({
                users: oldUsersList.filter(user => user.id !== id)
              });
            })
        }
      ]
    );
  }

  render() {
    const { users } = this.state;
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <NoAccount navigate={navigation.navigate} />
        <UsersList
          handlers={[this.handleSearch, this.handleSelect, this.handleDelete]}
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
      <Button
        title="Ajouter un patient"
        onPress={() => navigate("AddUser")}
        color={colors.SUCESS}
      />
      <Button
        title="Modifier email medecin"
        onPress={() => navigate("SetDoctor")}
        color={colors.PRIMARY}
      />
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
function UsersList({ users, handlers }) {
  const [handleSearch, handleSelect, handleDelete] = handlers;
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
            handleDelete={handleDelete}
            handleSelect={handleSelect}
          />
        )}
      />
    </View>
  );
}

/**
 * A row of the users list
 */
function UserElement({ user, id, handleDelete, handleSelect }) {
  return (
    <View style={styles.userBox}>
      <Text style={styles.userText}>
        {user.prenom} {user.nom}
      </Text>
      {/* <Text>Dernière connexion: {lastConnected}</Text> */}
      <View style={styles.actions}>
        <Button title="Choisir" onPress={() => handleSelect(id, user)} />
        <Button
          title="Supprimer"
          color={colors.DANGER}
          onPress={() => handleDelete(id, user)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    marginBottom: 35
  },
  noAccount: {
    alignItems: "center",
    padding: 5
  },
  noAccountText: {
    fontSize: 20
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  userBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
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
