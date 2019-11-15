import React from "react";
import { StyleSheet, Text, View } from "react-native";
import SignIn from "./src/SignIn";
import SignUp from "./src/SignUp";
import Score from "./src/Score";
import Test from "./src/Test";
<<<<<<< HEAD
import TestScreen from "./src/TestScreen";
=======
import Menu from "./src/Menu";
>>>>>>> 4c5e3414d4908cb6ffab544dbeacc39c3c3b5ec7
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

const Routes = {
  SignIn,
  SignUp,
  Score,
<<<<<<< HEAD
  Test,
  TestScreen
=======
  Menu
>>>>>>> 4c5e3414d4908cb6ffab544dbeacc39c3c3b5ec7
};

const MainNavigator = createStackNavigator(
  {
    ...Routes,
    SignIn: {
      screen: SignIn
    }
  },
  {
    // headerMode: 'none',
    initialRouteName: 'SignIn',
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
