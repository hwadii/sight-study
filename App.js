import React from "react";
import { StyleSheet, View } from "react-native";
import SetUser from "./src/SetUser";
import AddUser from "./src/AddUser";
import Score from "./src/Score";
import Test from "./src/Test";
import TestScreen from "./src/TestScreen";
import Menu from "./src/Menu";
import MainMenu from "./src/MainMenu"
import SetDoctor from "./src/SetDoctor"
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

const Routes = {
  SetUser,
  AddUser,
  Score,
  Test,
  TestScreen,
  Menu,
  Settings,
  MainMenu,
  SetDoctor
};

const MainNavigator = createStackNavigator(
  {
    ...Routes
  },
  {
    // headerMode: 'none',
    initialRouteName: "MainMenu",
    defaultNavigationOptions: {
      title: "Sight Study",
      headerBackTitle: "Retour"
      // TODO: Add aide avec différents textes en fonction de la vue
      // headerRight: () => <Text style={styles.helpText}>Aide 💡</Text>
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
 * get random element from an array
 */
Array.prototype.random = function() {
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
  },
  helpText: {
    fontSize: 16
  }
});
