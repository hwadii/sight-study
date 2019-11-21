import { StyleSheet, Dimensions } from "react-native";

export const styles = StyleSheet.create({
  containers: {
    flexDirection: "column",
    marginVertical: 20,
    alignItems: "center",
    paddingHorizontal: 5
  },
  actionButtons: {
    borderWidth: 1,
    width: "100%",
    maxWidth: Dimensions.get("window").width < 400 ? Dimensions.get("window").width : 400,
    borderColor: "#007BFF",
    backgroundColor: "#007BFF",
    padding: 15,
    marginTop: 7,
    borderRadius: 5
  },
  actionButtonsText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center"
  },
  headers: {
    fontSize: 22,
    paddingVertical: 5,
    fontWeight: "bold",
    textAlign: "center"
  }
});
