import React from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
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
      1: "",
      2: "",
      3: "",
      4: "",
      tableau: []
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

  async HandleSetAcuites() {
    const { tableau } = this.state
    console.log(tableau)
    await setAcuites(tableau);
    const { navigate } = this.props.navigation;
    navigate("SetUser");
  }

  handleChangeAcuite(e, i) {
    let { tableau } = this.state
    tableau[i] = e.nativeEvent.text
    this.setState({ tableau: tableau })
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
    const { tableau } = this.state

    return (
      <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>valeurs des acuités visuels a tester</Text>
        <Form
          tableau={tableau}
          navigate={this.props.navigation.navigate}
          HandleSetAcuites={this.HandleSetAcuites}
          handleChangeAcuite={this.handleChangeAcuite}
        />
      </View>
      </ScrollView>
    );
  }
}

function Form({ tableau, HandleSetAcuites, handleChangeAcuite }) {
  return (
    
    <View style={styles.form}>
      <View style={styles.board}>
        <View style={{ flex: 1, alignSelf: 'stretch',alignItems:'center', justifyContent: 'center'}}>
          <Text style={styles.label}> Echelle EDTRS St-Joseph</Text>
        </View>
        <View style={{ flex: 1, alignSelf: 'stretch' }}>
          <Text style={styles.label}>Acuité Visuel (décimal)</Text>
        </View>
      </View>
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
    <View style={styles.board}>
      <View style={{ flex: 1, alignSelf: 'stretch',alignItems:'center', justifyContent: 'center'}}>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={{ flex: 1, alignSelf: 'stretch' }}>
        <TextInput
          defaultValue={value}
          style={styles.inputs}
          //style={styles.input}
          autoCorrect={false}
          defaultValue={value}
          onChange={handler}
        />
      </View>
    </View>
  );
}


function Board({ tableau, handleChangeAcuite }) {
  return (
    <>
      <Field value={tableau[0]} label=" 4/40" handler={(e) => handleChangeAcuite(e, 0)}></Field>
      <Field value={tableau[1]} label=" 4/32" handler={(e) => handleChangeAcuite(e, 1)}></Field>
      <Field value={tableau[2]} label=" 4/25" handler={(e) => handleChangeAcuite(e, 2)}></Field>
      <Field value={tableau[3]} label=" 4/20" handler={(e) => handleChangeAcuite(e, 3)}></Field>
      <Field value={tableau[4]} label=" 4/16" handler={(e) => handleChangeAcuite(e, 4)}></Field>
      <Field value={tableau[5]} label=" 4/12,5" handler={(e) => handleChangeAcuite(e, 5)}></Field>
      <Field value={tableau[6]} label=" 4/10" handler={(e) => handleChangeAcuite(e, 6)}></Field>
      <Field value={tableau[7]} label=" 4/8" handler={(e) => handleChangeAcuite(e, 7)}></Field>
      <Field value={tableau[8]} label=" 4/6,3" handler={(e) => handleChangeAcuite(e, 8)}></Field>
      <Field value={tableau[9]} label=" 4/5" handler={(e) => handleChangeAcuite(e, 9)}></Field>
      <Field value={tableau[10]} label=" 4/4" handler={(e) => handleChangeAcuite(e, 10)}></Field>
      <Field value={tableau[11]} label=" 3/4" handler={(e) => handleChangeAcuite(e, 11)}></Field>
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
  board: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    alignItems:'center'
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    margin: 10
  },
  confirmButton: {
    borderWidth: 1,
    borderColor: "#007BFF",
    backgroundColor: "#007BFF",
    padding: 10,
    marginTop: 3
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center"
  },
  noAccount: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    textAlignVertical: 'center'
  },
  inputs: {
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 3,
    fontSize: 25,
    height: 50,
    paddingLeft: 5,
    paddingRight: 5,
    marginBottom: 6,
    width:200
  },
  label:{
    fontSize: 25,
    marginTop: 3,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
