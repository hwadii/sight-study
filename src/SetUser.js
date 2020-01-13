import React from "react";
import {
  StyleSheet,
  TextInput,
  FlatList,
  Button,
  TouchableOpacity,
  Text,
  View,
  Alert
} from "react-native";
import * as User from "../service/db/User";
import { setId, setUserName } from "./util/util";
import { styles as common, colors } from "./styles/common";

// TODO: Create Frequently used components?
// TODO: Look into issue when many names.
// TODO: Add segmented view

export default class SetUser extends React.Component {
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

  // TODO: Add alert in util
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
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={styles.noAccount}>
          <TouchableOpacity
            onPress={() => navigate("AddUser")}
            style={styles.actionButtons}
          >
            <Text style={common.actionButtonsText}>Ajouter un patient</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigate("SetDoctor")}
            style={styles.actionButtons}
          >
            <Text style={common.actionButtonsText}>Email du médecin</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigate("Settings")}
            style={styles.actionButtons}
          >
            <Text style={common.actionButtonsText}>Parametre de l'application</Text>
          </TouchableOpacity>
        </View>
        <UsersList
          handlers={[this.handleSearch, this.handleSelect, this.handleDelete]}
          users={users}
          navigate={navigate}
        />
      </View>
    );
  }
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
            user={{ prenom: item.prenom, nom: item.nom, sexe: item.sex }}
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
      <View style={{ justifyContent: "center" }}>
        <Text style={styles.userText}>
          {user.prenom} {user.nom}{" "}
          <Text style={styles.userTextMore}>({user.sexe})</Text>
        </Text>
      </View>
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
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 5
  },
  noAccountText: {
    fontSize: 20
  },
  actions: {
    flexDirection: "row"
  },
  userBox: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 18,
    paddingTop: 26,
    paddingBottom: 26
  },
  userText: {
    fontSize: 18,
    fontWeight: "bold"
  },
  userTextMore: {
    fontSize: 14,
    fontStyle: "italic",
    color: colors.DISABLED
  },
  actionButtons: {
    ...common.actionButtons,
    flex: 1,
    alignContent: "space-around",
    marginHorizontal: 5,
  }
});
