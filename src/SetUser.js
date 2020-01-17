import React from "react";
import {
  StyleSheet,
  TextInput,
  FlatList,
  Button,
  TouchableOpacity,
  TouchableHighlight,
  Text,
  View
} from "react-native";
import * as User from "../service/db/User";
import { setId, setUserName, getId, formatDate, showAlert } from "./util";
import { styles as common, colors } from "./styles/common";

export default class SetUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUserId: null,
      users: []
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
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
  async handleSelect(user) {
    const id = user.id;
    await setId(id.toString());
    await setUserName(user);
    showAlert(
      `La tablette est configurée pour ${user.prenom} ${user.nom}.`,
      () => this.setState({ currentUserId: id })
    );
  }

  handleEdit(user) {
    const { navigate } = this.props.navigation;
    navigate("EditUser", {
      user
    });
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
            <Text style={common.actionButtonsText}>
              Paramètre de l'application
            </Text>
          </TouchableOpacity>
        </View>
        <UsersList
          users={users}
          currentUserId={currentUserId}
          handlers={[this.handleSearch, this.handleSelect, this.handleEdit]}
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
  const [handleSearch, handleSelect, handleEdit] = handlers;
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
            handleEdit={handleEdit}
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
function UserElement({ user, currentUserId, handleEdit, handleSelect }) {
  const isSelected = user.id === currentUserId;
  return (
    <TouchableHighlight
      underlayColor="#f5f5f5"
      style={{ backgroundColor: isSelected ? "#e8e8e8" : "#fff" }}
      onPress={() => handleSelect(user)}
    >
      <View style={styles.userBox}>
        <Text style={styles.userText}>
          {user.prenom} {user.nom}
        </Text>
        <Text style={styles.userTextMore}>
          ({user.sex === "F" ? "Femme" : "Homme"})
        </Text>
        <Text style={{ fontSize: 18 }}>{user.distance} cm</Text>
        <Text style={{ fontSize: 18 }}>
          {formatDate(new Date(user.date_de_naissance))}
        </Text>
        <View style={styles.actions}>
          <Button
            title="Éditer"
            color={colors.SUCESS}
            onPress={() => handleEdit(user)}
          />
          <Button title="Exporter" color={colors.PRIMARY} />
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
    marginVertical: 10
  },
  actions: {
    flexDirection: "row"
  },
  userBox: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    paddingTop: 26,
    paddingBottom: 26,
    borderBottomWidth: 2,
    borderBottomColor: "#e8e8e8"
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
