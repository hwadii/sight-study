import React from "react";
import { StyleSheet, Text, View, Image, Alert, NetInfo } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import { scale } from "react-native-size-matters";

export default class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  handleOnTest() {
    const { navigate, route } = this.props;
    navigate(route, { eye: "right" });
  }

  render() {
    const { title, description, image } = this.props;
    return (
      <View style={styles.card}>
        <TouchableHighlight
          underlayColor="#fff"
          onPress={() => this.handleOnTest()}
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
        style={{ width: scale(80), height: scale(80), alignSelf: "center" }}
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
    marginHorizontal: 5
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
