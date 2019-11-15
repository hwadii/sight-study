import React from "react";
import { AsyncStorage, Dimensions, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import * as User from "./db/User";

async function getid() {
  try {
    const value = await AsyncStorage.getItem("id");
    if (value !== null) {
      return value;
    }
  } catch (error) {
    console.log(error);
  }
}

export default class Score extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      dates: [],
      s_o_d: [],
      s_o_g: [],
      isLoading: true
    };
  }

  componentDidMount() {
    getid().then(id => {
      User.getScore(id,score=>{
        let date_t =[]
        let sog_t = []
        let sod_t = []
        score.forEach(element => {
          date_t.push(element["date"])
          sog_t.push(element["oeil_gauche"])
          sod_t.push(element["oeil_droit"])
        });
        this.setState({
          dates : date_t,
          s_o_d : sod_t,
          s_o_g : sog_t
        })
        })
      
      console.log("apres" +this.state.score)
      this.setState({
        id,
        /*dates: dataForCurrentId.map(d => d.date),
        s_o_d: dataForCurrentId.map(d => d.score_oeil_droit),
        s_o_g: dataForCurrentId.map(d => d.score_oeil_gauche),*/
        isLoading: false
      });
    });
  }
  render() {
    if (this.state.isLoading || this.state.s_o_g.length==0 || this.state.s_o_d.length==0 ) {
      console.log("load");
      //console.log(this.state.score)
      return (
        <View>
          <Text>Pas de Scores disponible</Text>
        </View>
      );
    }
    return (
      <View>
        <Text>id : {this.state.id}</Text>
        <Text>Scores oeil gauche</Text>
        <LineChart
          data={{
            labels: this.state.dates,
            datasets: [
              {
                data: this.state.s_o_g
              }
            ]
          }}
          width={Dimensions.get("window").width - 50} // from react-native
          height={200}
          yAxisLabel={""}
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#f74a4a",
            backgroundGradientTo: "#f74a4a",
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
        <Text>Scores oeil droit</Text>
        <LineChart
          data={{
            labels: this.state.dates,
            datasets: [
              {
                data: this.state.s_o_d
              }
            ]
          }}
          width={Dimensions.get("window").width - 50} // from react-native
          height={200}
          yAxisLabel={""}
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#1f9ad3",
            backgroundGradientTo: "#1f9ad3",
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
      </View>
    );
  }
}
