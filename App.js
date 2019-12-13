import React from "react";
import { StyleSheet, Text, View } from "react-native";
import SignIn from "./src/SignIn";
import SignUp from "./src/SignUp";
import Score from "./src/Score";
import Test from "./src/Test";
import TestScreen from "./src/TestScreen";
import Menu from "./src/Menu";
import Settings from "./src/Settings"
import Selection from "./src/Selection"
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

// TODO: Use Context.Provider to track user preferences. 

const Routes = {
  SignIn,
  SignUp,
  Score,
  Test,
  TestScreen,
  Menu,
  Settings,
  Selection
};

const MainNavigator = createStackNavigator(
  {
    ...Routes,
  },
  {
    // headerMode: 'none',
    initialRouteName: "Selection",
    defaultNavigationOptions: {
      title: "Sight Study",
      headerBackTitle: "Retour",
      headerRight: () => <Text style={styles.helpText}>Aide 💡</Text>
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

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  helpText: {
    fontSize: 16
  }
});
