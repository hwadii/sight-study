import React from "react";
import {
  AsyncStorage,
  Dimensions,
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import * as User from "../db";
import { getId } from "./util";

// TODO: Breakup this component into a lot more.

export default class Score extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      dates: [],
      scoresOeilDroit: [],
      scoresOeilGauche: [],
      isLoading: true
    };
  }

  componentDidMount() {
    getId(AsyncStorage).then(id => {
      User.getScore(id, score => {
        this.setState({
          id,
          dates: score.map(d => d.date),
          scoresOeilDroit: score.map(d => d.oeil_droit),
          scoresOeilGauche: score.map(d => d.oeil_gauche),
          isLoading: false
        });
        setTimeout(() => {
          this.setState({ isLoading: false });
        }, 0);
        getId().then(id => {
          User.getScore(id, score => {
            this.setState({ id });
          });
        });
      });
    });
  }
  render() {
    const { isLoading, dates } = this.state;
    if (isLoading || dates.length == 0) {
      return (
        <View>
          <Text>pas de données</Text>
        </View>
      );
    }
    return (
      <View style={{ flex: 1, height: "100%", ...styles.container }}>
        {isLoading ? (
          <ActivityIndicator
            style={{ flex: 1, justifyContent: "center" }}
            size="large"
            color="#0000ff"
          />
        ) : (
          <>
            <LineChart
              data={{
                labels: this.state.dates,
                datasets: [
                  {
                    data: this.state.scoresOeilGauche,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
                  }
                ]
              }}
              width={Dimensions.get("window").width - 50} // from react-native
              height={this.state.scoresOeilGauche.length * 100}
              chartConfig={{
                backgroundColor: "#eee",
                backgroundGradientFrom: "#f74a4a",
                backgroundGradientTo: "#f74a4a",
                // decimalPlaces: 0, // optional, defaults to 2dp
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
            <LineChart
              data={{
                labels: this.state.dates,
                datasets: [
                  {
                    data: this.state.scoresOeilDroit,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
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
          </>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  }
});
