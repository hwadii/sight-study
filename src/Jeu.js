import React, { Component } from "react";
import { Image, View } from "react-native";
import { PermissionsAndroid } from "react-native";

import { StyleSheet, Text } from "react-native";

import QRCodeScanner from "react-native-qrcode-scanner";

export default class Test extends Component {
  constructor(props) {
    super(props)
    this.state = { indication : ' ' ,
                   color : 'black', 
                   wellPlaced : false, 
                   wrongEyeCount : 0,
                   eye : '',
                   timer: null,
                   counter: 0
    }
    this.props.navigation.navigate = this.props.navigation.navigate.bind(this);
  }

  componentDidMount(){
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    );
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    const { navigation } = this.props;
    this.setState({'eye': navigation.getParam('eye')})

    let timer = setInterval(this.tick, 1000);
    this.setState({timer});
  }
  
  tick =() => {
    this.setState({
      counter: this.state.counter + 1
    });
    if (this.state.counter >=2) this.setState({'indication' : "Veuillez vous placer devant l'écran", 'color' : 'black', 'wellPlaced' : false})
  }
  
  square = (x) => {
    return x*x
  }

  onSuccess = (e) => {
    if (e.data == "sight-study"){
      var distance = 30
      var eps = 1.5
      var eps2 = 0
      var limit = Math.min(e.bounds.origin[0].y, e.bounds.origin[0].y, e.bounds.origin[0].y);

      if ((limit < e.bounds.height/2+eps2 && this.state.eye=='left') || (limit > e.bounds.height/2-eps2 && this.state.eye=='right')){
        var tmp = Math.sqrt(this.square(e.bounds.origin[1].y - e.bounds.origin[0].y) + this.square(e.bounds.origin[1].x - e.bounds.origin[0].x))
        tmp = tmp + Math.sqrt(this.square(e.bounds.origin[2].y - e.bounds.origin[1].y) + this.square(e.bounds.origin[2].x - e.bounds.origin[1].x))
        tmp = tmp + Math.sqrt(this.square(e.bounds.origin[0].y - e.bounds.origin[2].y) + this.square(e.bounds.origin[0].x - e.bounds.origin[2].x))
        tmp = -0.05357*tmp + 43.3929
        
        if (tmp<distance-eps) this.setState({'indication' : "Eloignez vous de\n" + parseInt(10*Math.abs(distance-tmp))/10. + " cm", 'color' : 'black', 'wellPlaced' : false, 'wrongEyeCount' : 0, 'counter' : 0 })
        else{
          if (tmp>distance+eps) this.setState({'indication' : "Rapprochez vous de\n" + parseInt(10*Math.abs(distance-tmp))/10. + " cm", 'color' : 'black', 'wellPlaced' : false, 'wrongEyeCount' : 0, 'counter' : 0 })
          else this.setState({'indication' : "Parfait, ne bougez plus", 'wellPlaced' : true, 'color' : 'green', 'wrongEyeCount' : 0, 'counter' : 0 })
        }
      }else{
        this.setState({'wrongEyeCount' : this.state.wrongEyeCount+1, 'counter' : 0 })
      }
    }
    else console.log("pas bon qr code")
    
    if (this.state.wrongEyeCount >= 4) this.setState({'indication' : "Veuillez tester le bon oeuil", 'color' : 'black', 'wellPlaced' : false})
  }

  render() {
      const { navigation } = this.props;
      var img
      if (JSON.stringify(navigation.getParam('eye')) == 'left') img = require('../assets/imgleft.png')
      else img = require('../assets/imgright.png')
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <QRCodeScanner
        onRead={this.onSuccess}
        vibrate={false}
        reactivate={true}
        showMarker={true}
        containerStyle={this.state.wellPlaced? {opacity: 0} : {opacity: 100}}
        customMarker={<Image
          style={{ width: "250%", height: "250%", marginTop: "40%" }}
          tintColor={this.state.color}
          source={ img }
        />}
        cameraType="front"
        bottomContent={
          <Text style={styles.buttonText}>{this.state.indication}</Text>
        }
      />

      <Text style={styles.text} onPress={() => {
          this.props.navigation.navigate('Test', {
            eye: 'left',
          });
        }}>
        {this.state.wellPlaced? this.state.indication : ''}
      </Text>
          </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonText: {
    fontSize: 21,
    color: "rgb(255,255,255)"
  },
  marker: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0
  },
  text: {
    position: 'absolute',
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center"
  }
});
