import React from "react";
import { StyleSheet, View } from "react-native";
import SetUser from "./src/SetUser";
import AddUser from "./src/AddUser";
import EditUser from "./src/EditUser";
import Score from "./src/Score";
import Test from "./src/Test";
import TestScreen from "./src/TestScreen";
import Menu from "./src/Menu";
import MainMenu from "./src/MainMenu";
import SetDoctor from "./src/SetDoctor";
import Settings from "./src/Settings";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { initDB } from "./service/db/User";

const Routes = {
  SetUser,
  AddUser,
  Score,
  Test,
  TestScreen,
  Menu,
  MainMenu,
  SetDoctor,
  Settings,
  EditUser
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
    }
  }
);

const Navigation = createAppContainer(MainNavigator);

class App extends React.Component {
  async componentDidMount() {
    await initDB();
  }

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
  }
});
