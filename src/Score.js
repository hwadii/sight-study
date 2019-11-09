import React from 'react';
import { AsyncStorage, Dimensions, StyleSheet, Text, Button, ScrollView, View, FlatList, TouchableHighlight } from 'react-native';
import { LineChart } from 'react-native-chart-kit'


async function getid() {
  try {
    const value = await AsyncStorage.getItem('id');
    if (value !== null) {
      // We have data!!
      return value
    }
  } catch (error) {
    // Error retrieving data
  }

}
const data = [
  {
    id: "Aaren Last name",
    date: "24/4/2018",
    score_oeil_droit: 50,
    score_oeil_gauche: 5,
  },
  {
    id: "Aaren Last name",
    date: "22/4/2018",
    score_oeil_droit: 1,
    score_oeil_gauche: 10,
  },
  {
    id: "Aarika Last name",
    date: "20/2/2019",
    score_oeil_droit: 8,
    score_oeil_gauche: 27,
  },
  {
    id: "Aarika Last name",
    date: "10/8/2019",
    score_oeil_droit: 3,
    score_oeil_gauche: 17,
  },
  {
    date: "20/5/2019",
    score_oeil_droit: 44,
    score_oeil_gauche: 32,
  },
  {
    date: "10/10/2019",
    score_oeil_droit: 21,
    score_oeil_gauche: 22,
  }
]


async function getdates(){
  try {
    dates= []
    s_o_d =[]
    s_o_g = []
    let userId = await AsyncStorage.getItem('id');
    if (userId !== "") {
      console.log(userId)
      data.forEach(e => {
        if (e.id === userId) {
          dates.push(e.date)
        }
      })
      console.log(dates)
      return (dates)
    }
  } catch (error) {
    // Error retrieving data
    console.log(error.message);
  }
}

async function getoeildroit(){
  try {
    dates= []
    s_o_d =[]
    s_o_g = []
    let userId = await AsyncStorage.getItem('id');
    if (userId !== "") {
      console.log(userId)
      data.forEach(e => {
        if (e.id === userId) {
          s_o_d.push(e.score_oeil_droit)
        }
      })
      console.log(s_o_d)
      return (s_o_d)
    }
  } catch (error) {
    // Error retrieving data
    console.log(error.message);
  }
}

async function getoeilgauche(){
  try {
    dates= []
    s_o_d =[]
    s_o_g = []
    let userId = await AsyncStorage.getItem('id');
    if (userId !== "") {
      console.log(userId)
      data.forEach(e => {
        if (e.id === userId) {
          s_o_g.push(e.score_oeil_gauche)
        }
      })
      console.log(s_o_g)
      return (s_o_g)
    }
  } catch (error) {
    // Error retrieving data
    console.log(error.message);
  }
}


export default class Score extends React.Component {
  constructor(props) {
    super(props)
  }
  state = {
    id: "",
    dates:[],
    s_o_d:[],
    s_o_g:[]
  }
  componentDidMount() {
    getid().then(id => {
      this.setState({
        id
      })
    });
    getdates().then(dates =>{
      this.setState({
        dates
      })
    });
    getoeildroit().then(s_o_d =>{
      this.setState({
        s_o_d
      })
    });
    getoeilgauche().then(s_o_g =>{
      this.setState({
        s_o_g
      })
    });
  }
  render() {
    const { navigation } = this.props;
    console.log("trest")
    console.log(this.state.dates)
    console.log(this.state.s_o_d)
    console.log(this.state.s_o_g)
    if(this.state.s_o_g.length==0 || this.state.s_o_d.length==0){
      console.log("load")
      return (
        <View >
        <Text>Pas de Scores disponible </Text>
        </View>
      )
    }
    return (
      <View >
        <Text>id : {this.state.id}</Text>
        <Text >
          Scores oeil gauche
        </Text>
        <LineChart
          data={{
            labels: this.state.dates,
            datasets: [{
              data: this.state.s_o_g
            }
            ]
          }}
          width={(Dimensions.get('window').width - 50)} // from react-native
          height={200}
          yAxisLabel={''}
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#f74a4a',
            backgroundGradientTo: '#f74a4a',
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
        <Text>
          Scores oeil droit
        </Text>
        <LineChart
          data={{
            labels: this.state.dates,
            datasets: [{
              data:  this.state.s_o_d
            }
            ]
          }}
          width={(Dimensions.get('window').width - 50)} // from react-native
          height={200}
          yAxisLabel={''}
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#1f9ad3',
            backgroundGradientTo: '#1f9ad3',
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />

      </View >

    )
  }




}