import React from "react";
import { StyleSheet, View } from "react-native";
import SetUser from "./src/SetUser";
import AddUser from "./src/AddUser";
import Score from "./src/Score";
import Test from "./src/Test";
import TestScreen from "./src/TestScreen";
import Menu from "./src/Menu";
import MainMenu from "./src/MainMenu";
import SetDoctor from "./src/SetDoctor";
import Settings from "./src/Settings";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

const Routes = {
  SetUser,
  AddUser,
  Score,
  Test,
  TestScreen,
  Menu,
  MainMenu,
  SetDoctor,
  Settings
};

const MainNavigator = createStackNavigator(
  {
    ...Routes
  },
  {
    // headerMode: 'none',
    initialRouteName: "TestScreen",
    defaultNavigationOptions: {
      title: "Sight Study",
      headerBackTitle: "Retour"
    }
  }
);

const Navigation = createAppContainer(MainNavigator);

class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Navigation />
      </View>
    );
  }
}

/**
 * get random char from an string
 */
String.prototype.random = function() {
  const idx = Math.floor(Math.random() * this.length);
  return this[idx];
};

/**
 * check if letter is in array
 * exemple: ["A", "Ah", "As"].lenientIncludes("a") => true
 *          needs to accept "Ah" too (maybe?)
 */
Array.prototype.lenientIncludes = function(letter) {
  return (
    this.includes(letter) ||
    this.includes(letter.toUpperCase()) ||
    this.some(el => el[0] === letter)
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
