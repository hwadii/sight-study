import React, { Component } from 'react';
import { Text , View} from 'react-native'

export default class MenuLeftRigth extends Component {
  
  constructor(props) {
    super(props);
    this.sayHello = this.sayHello.bind(this);
    this.props.navigation.navigate = this.props.navigation.navigate.bind(this);
  }

  sayHello() {
    alert('Hello!');
  }
  
  render(){
    return (
        // <ButtonToolbar>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

        <Text onPress={() => {
            this.props.navigation.navigate('Test', {
              eye: 'left',
            });
          }}>
          Left !
        </Text>
        <Text onPress={() => {
            this.props.navigation.navigate('Test', {
              eye: 'right',
            });
          }}>
          Right !
        </Text>
            </View>
        // </ButtonToolbar>
    );
  }
}
