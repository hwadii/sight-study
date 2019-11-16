import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";

export default class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { title, description, route, navigate, image } = this.props;
    return (
      <View style={styles.card}>
        <TouchableHighlight
          underlayColor="#fff"
          onPress={() => navigate(route)}
        >
          <Content title={title} description={description} image={image} />
        </TouchableHighlight>
      </View>
    );
  }
}

function Content({ title, description, image }) {
  return (
    <View style={styles.content}>
      <Image
        style={{ width: 192, height: 192, alignSelf: "center" }}
        source={image}
      />
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
    // height: 200,
    width: "90%"
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
    borderRadius: 5,
    paddingVertical: 20
  },
  description: {
    fontSize: 16,
    paddingHorizontal: 30,
    textAlign: "center",
    color: "#979797"
  }
});
