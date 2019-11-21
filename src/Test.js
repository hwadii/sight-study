import React from 'react';
import { Button, Text, View } from "react-native";

export default class extends React.Component {
  constructor(props) {
	super(props);
	this.state = { feedback: '', name: 'Name', email: 'email@example.com' };
  }

  sendMail(){
    fetch('http://192.168.43.195:3000/test').then(response => console.log(response))
  }

  componentDidMount() {
      this.setState({feedback: 'bonjour', name: 'sylvain', email: 'sylvain.huss@gmail.com'})
  }

  render() {
    return (
      <View>
        <Button onPress={() => this.sendMail()} title='Activer les lasers'>
          
        </Button>
      </View>
    )
  }
}