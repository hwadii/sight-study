import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";

// TODO: Add SVG Icons for cards.

export default class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { title, description, route, navigate } = this.props;
    return (
      <View style={styles.card}>
        <TouchableHighlight
          underlayColor="#fff"
          onPress={() => navigate(route)}
        >
          <Content title={title} description={description} />
        </TouchableHighlight>
      </View>
    );
  }
}

function Content({ title, description }) {
  return (
    <View style={styles.content}>
      <Text style={styles.header}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    justifyContent: "center",
    marginVertical: 10,
    height: 200,
    width: "80%"
  },
  header: {
    fontSize: 22,
    paddingVertical: 5,
    fontWeight: "bold",
    textAlign: "center"
  },
  content: {
    height: "100%",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 5
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#979797",
  }
});
