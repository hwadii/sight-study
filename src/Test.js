import React from "react";
import * as User from "./db/User";
import { StyleSheet, Text, View } from "react-native";

class Test extends React.Component {
  componentDidMount() {
    User.initDB();
    User.addUser("Hajji", "Wadii", "1234", 0);
    User.getUsers();
  }
  render() {
    return (
      <View>
        <Text>Test</Text>
      </View>
    );
  }
}

export default Test;
