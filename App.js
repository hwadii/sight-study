import React from "react";
import { StyleSheet, View } from "react-native";
import SetUser from "./src/SetUser";
import AddUser from "./src/AddUser";
import EditUser from "./src/EditUser";
import Score from "./src/Score";
import TestScreen from "./src/TestScreen";
import Menu from "./src/Menu";
import Settings from "./src/Settings";
import MainMenu from "./src/MainMenu";
import DistanceFinder from "./src/DistanceFinder";
import Etdrs from "./src/Etdrs";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import * as Font from "expo-font";
import { initDB } from "./service/db/User";
import SplashScreen from 'react-native-splash-screen'
import { getAdminPin, getId, setAdminPin , clear} from './src/util'
import DialogInput from 'react-native-dialog-input';

const Routes = {
  SetUser,
  AddUser,
  Score,
  TestScreen,
  Menu,
  Settings,
  MainMenu,
  DistanceFinder,
  Settings,
  EditUser,
  Etdrs
};

const MainNavigator = (init) => createStackNavigator(
  {
    ...Routes
  },
  {
    // headerMode: 'none',
    initialRouteName: init,
    defaultNavigationOptions: {
      title: "Sight Study",
      headerBackTitle: "Retour"
    }
  }
);

class App extends React.Component {
  state = { 
    fontLoaded: false,
    pin: null,
    id: null,
    isDialogVisible: false,
    Navigation: null
  };


  async componentDidMount() {
    SplashScreen.show()
    // await clear()
    await initDB();
    await Font.loadAsync({
      "optician-sans": require("./assets/fonts/Optician-Sans.otf")
    });
    this.setState({
      fontLoaded: true,
      pin: await getAdminPin(),
      id: await getId(),
      isDialogVisible: await getAdminPin() != null ? false : true,
      Navigation: await getId() == null ? createAppContainer(MainNavigator("SetUser")) : createAppContainer(MainNavigator("Menu"))
    });
    SplashScreen.hide()
  }

  openDialog() {
    this.setState({isDialogVisible: true});
  }

  hideDialog(){
    this.setState({isDialogVisible: false});
  }

  setPin(value) {
    setAdminPin(value)
    this.hideDialog()
  }

  render() {
    const { fontLoaded, Navigation } = this.state;
    return fontLoaded ? (
      <View style={styles.container}>
        <DialogInput isDialogVisible={this.state.isDialogVisible}
          title={"Configuration"}
          message={"Entrer un code PIN"}
          textInputProps={{keyboardType:"numeric"}}
          hintInput ={"####"}
          submitInput={ (inputText) => {this.setPin(inputText)} }
          closeDialog={ () => {this.hideDialog()}}>
        </DialogInput>
        <Navigation init={"SetUser"} />
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
