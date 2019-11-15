import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";

export default class Card extends React.Component {
  render() {
    const { title, description, route, navigate } = this.props;
    // console.log(navigate(route));
    console.log(this.props);
    return (
      // <View style={styles.card}>
      <TouchableHighlight
        onPress={this.handlePress}
        style={styles.button}
      >
        <View>
          <Text style={styles.header}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </TouchableHighlight>
      // </View>
    );
  }

  handlePress() {
    console.log(this.props.route)
  }
}

const styles = StyleSheet.create({
  card: {
    // flex: 1,
    marginVertical: 5,
    width: "100%",
    shadowColor: "#979797",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 10
  },
  header: {
    fontSize: 22,
    // paddingVertical: "1rem",
    fontWeight: "bold",
    textAlign: "center"
  },
  button: {
    paddingVertical: ".5rem",
    paddingHorizontal: ".5rem"
  },
  description: {
    fontSize: 16,
    color: "#979797"
  }
});
