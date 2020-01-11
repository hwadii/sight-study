import React from "react";
import { StyleSheet, View } from "react-native";
import SetUser from "./src/SetUser";
import AddUser from "./src/AddUser";
import AddDoctor from "./src/AddDoctor";
import Score from "./src/Score";
import Test from "./src/Test";
import TestScreen from "./src/TestScreen";
import Menu from "./src/Menu";
import Settings from "./src/Settings"
import MainMenu from "./src/MainMenu"
import SetDoctor from "./src/SetDoctor"
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

const Routes = {
  SetUser,
  AddUser,
  AddDoctor,
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

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  helpText: {
    fontSize: 16
  }
});
