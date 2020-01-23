import React from "react";
import { StyleSheet, Text, View, Image, Alert, NetInfo } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { scale } from "react-native-size-matters";

export default class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  handleOnTest() {
    const { navigate, route } = this.props;
    navigate(route);
  }

  render() {
    const { title, description, image, style } = this.props;
    return (
      <View
        style={
          style === "settings"
            ? { ...styles.card, maxHeight: 140 }
            : styles.card
        }
      >
        <TouchableOpacity
          onPress={() => this.handleOnTest()}
          style={styles.inner}
        >
          <Content
            title={title}
            description={description}
            image={image}
            style={style}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

function Content({ title, description, image, style }) {
  const isSettings = style === "settings";
  return (
    <View style={styles.content}>
      <ScaledImage image={image} isSettings={isSettings} />
      {isSettings ? null : (
        <>
          <Text style={styles.header}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </>
      )}
    </View>
  );
}

function ScaledImage({ image, isSettings }) {
  return (
    <>
      {isSettings ? (
        <Image
          style={{ width: scale(30), height: scale(30), alignSelf: "center" }}
          source={image}
        />
      ) : (
        <Image
          style={{ width: scale(80), height: scale(80), alignSelf: "center" }}
          source={image}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    justifyContent: "center",
    margin: 5
  },
  header: {
    fontSize: 22,
    paddingVertical: 5,
    fontWeight: "bold",
    textAlign: "center"
  },
  headerSmall: {
    fontSize: 12,
    paddingVertical: 5,
    fontWeight: "bold",
    textAlign: "center"
  },
  content: {
    height: "100%",
    justifyContent: "center"
  },
  inner: {
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
