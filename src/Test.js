import React from "react";
import * as User from "./db/User";
import { StyleSheet, Text, View } from "react-native";
import util from "./util/util";
import Score from "./Score";

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
    // User.initDB();
    // User.dropDB();
    // User.removeUser(1);
    // User.addUser("Adam", "Colas", "1234", 0, user => this.setState({ user }));
    // User.addUser("Wadii", "Hajji", "1234", 0, user => console.log(user));
    // User.addUser("Adam", "Colas", "1234", 0, user => console.log(user));
    User.getUsers(users => this.setState({ users }))
    // User.addScore("1",30,30,(exo)=>console.log(exo))
    //User.getExos("1",(exo)=>console.log(exo))
    User.getScore("1",(exo)=>console.log(exo))
    
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
