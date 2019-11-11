import React from "react";
import * as User from "./db/User";
import { StyleSheet, Text, View } from "react-native";
import util from "./util/util";

class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      user: "",
      users: []
    };
  }

  componentDidMount() {
    User.initDB();
    // User.removeUser(2);
    // User.addUser("Sylvain", "Huss", "1234", 0);
    // User.getUsers();
    // this.setState({
    //   id: User.getUser("Hajji", "Wadii"),
    //   users: User.getUsers()
    // });
    // User.getUser("Hajji", "Wadii", id => this.setState({ id }));
    User.getUsers(users => this.setState({ users }));
  }
  render() {
    const { id, users } = this.state;
    console.log(this.state);
    return (
      <View>
        <Text>
          <Text>users</Text>
          {users.map(user => (
            <Text key={user.id}>
              {user.nom} {user.prenom}
            </Text>
          ))}
        </Text>
      </View>
    );
  }
}

export default Test;
