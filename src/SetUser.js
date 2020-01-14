import React from "react";
import {
  StyleSheet,
  TextInput,
  FlatList,
  Button,
  TouchableOpacity,
  TouchableHighlight,
  Text,
  View,
  Alert
} from "react-native";
import * as User from "../service/db/User";
import { setId, setUserName, getId } from "./util";
import { styles as common, colors } from "./styles/common";

export default class SetUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUserId: null,
      users: []
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    this.willFocusSub = this.props.navigation.addListener(
      "willFocus",
      async () => {
        this.setState({
          users: await User.getUsers(),
          currentUserId: await getId()
        });
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSub.remove();
  }

  async handleSearch(e) {
    this.setState({
      users: await User.getUsersLike(e.nativeEvent.text)
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
          onPress: () => this.setState({ currentUserId: id })
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
          onPress: () => {
            // FIXME: await ici?
            User.removeUser(id);
            this.setState({
              users: oldUsersList.filter(user => user.id !== id)
            });
          }
        }
      ]
    );
  }

  render() {
    const { users, currentUserId } = this.state;
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
            <Text style={common.actionButtonsText}>Paramètre de l'application</Text>
          </TouchableOpacity>
        </View>
        <UsersList
          users={users}
          currentUserId={currentUserId}
          handlers={[this.handleSearch, this.handleSelect, this.handleDelete]}
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
function UsersList({ users, currentUserId, handlers }) {
  const [handleSearch, handleSelect, handleDelete] = handlers;
  return (
    <View style={styles.usersList}>
      <FlatList
        data={users}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={<SearchBar handleSearch={handleSearch} />}
        renderItem={({ item }) => (
          <UserElement
            user={item}
            currentUserId={currentUserId}
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
function UserElement({ user, currentUserId, handleDelete, handleSelect }) {
  const { id, nom, prenom, sex, date_de_naissance } = user;
  const isSelected = id === currentUserId;
  return (
    <TouchableHighlight
      underlayColor="#f5f5f5"
      style={{ backgroundColor: isSelected ? "#f5f5f5" : "#fff" }}
      onPress={() => handleSelect(id, user)}
    >
      <View style={styles.userBox}>
        <Text style={styles.userText}>
          {prenom} {nom}
        </Text>
        <Text style={styles.userTextMore}>
          ({sex === "F" ? "Femme" : "Homme"})
        </Text>
        <Text style={{ fontSize: 18 }}>
          {new Date(date_de_naissance).toLocaleDateString()}
        </Text>
        <View style={styles.actions}>
          <Button title="Exporter" color={colors.PRIMARY} />
          <Button
            title="Supprimer"
            color={colors.DANGER}
            onPress={() => handleDelete(id, user)}
          />
        </View>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  noAccount: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 5
  },
  noAccountText: {
    fontSize: 20,
    marginVertical: 10
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
    paddingBottom: 26,
    borderBottomWidth: 2,
    borderBottomColor: "#f5f5f5"
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
    marginHorizontal: 5
  }
});
