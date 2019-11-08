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

export default class Score extends React.Component {
  constructor(props) {
    super(props)
  }
  state = {
    id: ""
  }
  componentDidMount() {
    getid().then(id => {
      this.setState({
        id
      })
    });
  }
  render() {
    const { navigation } = this.props;
    const dates = [0]
    const s_o_d = [0]
    const s_o_g = [0]
    const getId = async () => {
      try {
        let userId = await AsyncStorage.getItem('id');
        if (userId !== "") {
          console.log(userId)
          data.forEach(e => {
            if (e.id === userId) {
              dates.push(e.date)
              s_o_d.push(e.score_oeil_droit)
              s_o_g.push(e.score_oeil_gauche)
            }
          })
        }
      } catch (error) {
        // Error retrieving data
        console.log(error.message);
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
    getId()
    return (
      <View >
        <Text>id : {this.state.id}</Text>
        <Text >
          Scores oeil gauche
        </Text>
        <LineChart
          data={{
            labels: dates,
            datasets: [{
              data: s_o_g
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
            labels: dates,
            datasets: [{
              data: s_o_d
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