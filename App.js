import React from "react";
import { StyleSheet, View } from "react-native";
import SetUser from "./src/SetUser";
import AddUser from "./src/AddUser";
import EditUser from "./src/EditUser";
import Score from "./src/Score";
import TestScreen from "./src/TestScreen";
import Menu from "./src/Menu";
import Settings from "./src/Settings";
import DistanceFinder from "./src/DistanceFinder";
import Etdrs from "./src/Etdrs";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import * as Font from "expo-font";
import { initDB } from "./service/db/User";
import SplashScreen from "react-native-splash-screen";
import { getAdminPin, getId, clear, initDefault } from "./src/util";

const Routes = {
  SetUser,
  AddUser,
  Score,
  TestScreen,
  Menu,
  Settings,
  DistanceFinder,
  Settings,
  EditUser,
  Etdrs
};

const MainNavigator = createStackNavigator(
  {
    ...Routes
  },
  {
    // headerMode: 'none',
    initialRouteName: "Menu",
    defaultNavigationOptions: {
      title: "Sight Study",
      headerBackTitle: "Retour"
    }
  }
);

const Navigation = createAppContainer(MainNavigator);

class App extends React.Component {
  state = {
    fontLoaded: false,
    Navigation: null
  };

  async componentDidMount() {
    SplashScreen.show();
    // await clear()
    await initDB();
    await Font.loadAsync({
      "optician-sans": require("./assets/fonts/Optician-Sans.otf")
    });
    this.setState({
      fontLoaded: true
    });
    await initDefault();
    SplashScreen.hide();
  }

  render() {
    const { fontLoaded } = this.state;
    return fontLoaded ? (
      <View style={styles.container}>
        <Navigation />
      </View>
    ) : null;
  }
}

/**
 * get random char from an string
 */
String.prototype.random = function() {
  const idx = Math.floor(Math.random() * this.length);
  return this[idx];
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
