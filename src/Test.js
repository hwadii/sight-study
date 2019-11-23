import React from 'react';
import { Button, Text, View } from "react-native";

export default class extends React.Component {
  constructor(props) {
	super(props);
	this.state = { feedback: '', name: 'Name', email: 'email@example.com' };
  }

  sendMail(){
    let data = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        to:"sylvain.huss@gmail.com", 
        nom:"huss", 
        prenom:"sylvain",
        score: 200
      })}

      fetch('http://192.168.43.195:3000/mail', data)
      .then(response => console.log(response))
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