import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity
} from "react-native";
import { scale } from "react-native-size-matters";
import { styles as common } from "./styles/common";
import { setAcuites, getAcuites } from "./util";

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      1 :"",
      2 :"",
      3 :"",
      4 :"",
      tableau :[]
    };
    this.handleChangeField = this.handleChangeField.bind(this);
    this.handleModifDistance = this.handleModifDistance.bind(this);
    this.handleChangeAcuite = this.handleChangeAcuite.bind(this)
    this.HandleSetAcuites = this.HandleSetAcuites.bind(this)
    this.props.navigation.navigate = this.props.navigation.navigate.bind(this);
    
  }

  handleChangeField(e, field) {
    this.setState({ [field]: e.nativeEvent.text });
  }

  async HandleSetAcuites(){
    const {tableau} = this.state
    console.log(tableau)
    await setAcuites(tableau);
    const { navigate } = this.props.navigation;
    navigate("SetUser");
  }

  handleChangeAcuite(e, i){
    let {tableau} = this.state
    tableau[i] = e.nativeEvent.text
    this.setState({tableau: tableau})
  }

  async handleModifDistance() {
    const { navigate } = this.props.navigation;
    navigate("SetUser");
  }

  async componentDidMount() {

      this.setState({
        tableau: await getAcuites(),
      });
  }

  render() {
    const {tableau} = this.state

    return (
      <View style={styles.container}>
        <Form
          tableau= {tableau}
          navigate={this.props.navigation.navigate}
          HandleSetAcuites={this.HandleSetAcuites}
          handleChangeAcuite={this.handleChangeAcuite}
        />
      </View>
    );
  }
}

function Form({tableau, HandleSetAcuites, handleChangeAcuite }) {
  return (
    <View style={styles.form}>
      <Board tableau={tableau} handleChangeAcuite={handleChangeAcuite}></Board>
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => HandleSetAcuites()}
      >
        <Text style={styles.confirmButtonText}>CONFIRMER</Text>
      </TouchableOpacity>
    </View>
  );
}

function Field({ value, label, handler }) {
  return (
    <>
      <Text style={common.inputsLabels}>{label}</Text>
      <TextInput
        defaultValue={value}
        style={common.inputs}
        autoCorrect={false}
        defaultValue={value}
        onChange={handler}
      />
    </>
  );
}


function Board ({tableau,handleChangeAcuite}){
  return(
    <>
      <Text>valeurs des acuités visuels a tester</Text>
      <Field value={tableau[0]} label=" 1 acuité" handler={(e)=>handleChangeAcuite(e,0)}></Field>
      <Field value={tableau[1]} label=" 2 acuité" handler={(e)=>handleChangeAcuite(e,1)}></Field>
      <Field value={tableau[2]} label=" 3 acuité" handler={(e)=>handleChangeAcuite(e,2)}></Field>
      <Field value={tableau[3]} label=" 4 acuité" handler={(e)=>handleChangeAcuite(e,3)}></Field>
      <Field value={tableau[4]} label=" 5 acuité" handler={(e)=>handleChangeAcuite(e,4)}></Field>
      <Field value={tableau[5]} label=" 6 acuité" handler={(e)=>handleChangeAcuite(e,5)}></Field>
      <Field value={tableau[6]} label=" 7 acuité" handler={(e)=>handleChangeAcuite(e,6)}></Field>
      <Field value={tableau[7]} label=" 8 acuité" handler={(e)=>handleChangeAcuite(e,7)}></Field>
      <Field value={tableau[8]} label=" 9 acuité" handler={(e)=>handleChangeAcuite(e,8)}></Field>
      <Field value={tableau[9]} label=" 10 acuité" handler={(e)=>handleChangeAcuite(e,9)}></Field>
      <Field value={tableau[10]} label=" 11 acuité" handler={(e)=>handleChangeAcuite(e,10)}></Field>
      <Field value={tableau[11]} label=" 12 acuité" handler={(e)=>handleChangeAcuite(e,11)}></Field>
    </>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: 15
  },
  form: {
    width: scale(320),
    maxWidth: Dimensions.get("window").width
  },
  board:{
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    margin: 10
  },
  confirmButton: {
    borderWidth: 1,
    borderColor: "#007BFF",
    backgroundColor: "#007BFF",
    padding: 15,
    marginTop: 7
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center"
  }
});
