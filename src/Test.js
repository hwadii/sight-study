import React from "react";
import * as User from "./db/User";
import { StyleSheet, Text, View} from "react-native";
import util from "./util/util";
import Score from "./Score";
import { TextInput } from "react-native-gesture-handler";

class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      user: "",
      users: [],
      scores : []
    };
    this.setInputState = this.setInputState.bind(this);
  }

  setInputState(e){
    text = e.nativeEvent.text
    User.getUsersLike(text, users => this.setState({users}))
  }

  componentDidMount() {
    // User.dropDB();
    User.initDB();
    // User.removeUser(1);
    // User.addUser("Adam", "Colas", "1234", 0, user => console.log(user));
    // User.addUser("Wadii", "Hajji", "1234", 0, user => console.log(user));
    // User.addUser("Adam", "Colas", "1234", 0, user => console.log(user));
    User.getUsers(users => console.log(users))
    // User.addScore("1",50,50,res => console.log("score ajouté"))

    // User.getScore("1", scores => this.setState({ scores }))
    
  }
  render() {
    const { id, users } = this.state;
    console.log(this.state);
    return (
      <View>
        <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 1 }} onChange={this.setInputState} />

        <Text>
          <Text>{"Users : \n"}</Text>
          {this.state.users.map(user => (
            <Text key={user.id}>
              {user.prenom} {user.nom} {user.duplicata > 0 && "(" + user.duplicata + ")"} {"\n"}
            </Text>
          ))}
        </Text>
      </View>
    );
  }
}

export default Test;
