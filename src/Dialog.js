import React from "react";
import DialogInput from "react-native-dialog-input";
import { getAdminPin, showAlert } from "./util";
import { withNavigation } from "react-navigation";

class Dialog extends React.Component {
  state = {
    isDialogVisible: false,
    pin: ""
  };

  async componentDidMount() {
    this.setState({
      pin: await getAdminPin()
    });
  }

  componentWillUnmount() {
    const { onClose } = this.props;
    onClose();
  }

  goToSettings(value) {
    const {
      onClose,
      navigation: { navigate }
    } = this.props;
    const { pin } = this.state;
    if (pin === null || pin === value) {
      onClose();
      navigate("SetUser");
    } else {
      onClose();
      showAlert("Mauvais code PIN");
    }
  }

  openDialog() {
    this.setState({ isDialogVisible: true });
  }

  hideDialog() {
    this.setState({ isDialogVisible: false });
  }

  render() {
    const { isDialogVisible, onClose } = this.props;
    return (
      <DialogInput
        isDialogVisible={isDialogVisible}
        title={"Accès aux réglages"}
        message={"Entrer le code PIN"}
        hintInput={"####"}
        submitInput={inputText => {
          this.goToSettings(inputText);
        }}
        closeDialog={() => onClose()}
      ></DialogInput>
    );
  }
}

export default withNavigation(Dialog);
