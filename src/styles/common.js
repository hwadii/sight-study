import { StyleSheet, Dimensions } from "react-native";

export const colors = {
  DANGER: "#dc3545",
  SUCESS: "#28a745",
  PRIMARY: "#007bff",
  DISABLED: "#6c757d"
};

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
    maxWidth:
      Dimensions.get("window").width < 400
        ? Dimensions.get("window").width
        : 400,
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
  },
  important: {
    fontSize: 18
  },
  inputs: {
    borderTopWidth: 1,
    borderColor: "#CCCCCC",
    borderBottomWidth: 1,
    height: 50,
    fontSize: 25,
    paddingLeft: 5,
    paddingRight: 5,
    marginBottom: 6
  },
  inputsLabels: {
    fontSize: 18,
    marginTop: 7
  }
});
