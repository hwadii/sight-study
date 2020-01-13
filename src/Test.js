import React, { Component, View } from 'react';
import {PermissionsAndroid,  Image} from 'react-native';

import {
  AppRegistry,
  StyleSheet,
  Text,
} from 'react-native';
 
import QRCodeScanner from 'react-native-qrcode-scanner';


export default class Test extends Component {
  constructor(props) {
    super(props)
    this.state = { indication : ' ' ,
                   color : 'black', 
                   wellPlacedCount : 0, 
                   wrongEyeCount : 0,
                   eye : ''
    }
  }

  componentDidMount(){
    const { navigation } = this.props;
    this.setState({'eye': JSON.stringify(navigation.getParam('eye'))})
  }
  
  square = (x) => {
    return x*x
  }

  onSuccess = (e) => {
    if (e.data == "sight-study"){
      var distance = 30
      var eps = 0.5
      var eps2 = 0
      var wellPlacedInaRow = 10
      var limit = Math.min(e.bounds.origin[0].y, e.bounds.origin[0].y, e.bounds.origin[0].y);

      if ((limit < e.bounds.height/2+eps2 && this.state.eye=='"left"') || (limit > e.bounds.height/2-eps2 && this.state.eye=='"right"')){
        var tmp = Math.sqrt(this.square(e.bounds.origin[1].y - e.bounds.origin[0].y) + this.square(e.bounds.origin[1].x - e.bounds.origin[0].x))
        tmp = tmp + Math.sqrt(this.square(e.bounds.origin[2].y - e.bounds.origin[1].y) + this.square(e.bounds.origin[2].x - e.bounds.origin[1].x))
        tmp = tmp + Math.sqrt(this.square(e.bounds.origin[0].y - e.bounds.origin[2].y) + this.square(e.bounds.origin[0].x - e.bounds.origin[2].x))
        tmp = -0.05357*tmp + 43.3929
        
        if (tmp<distance-eps) this.setState({'indication' : "s'éloigner", 'color' : 'black', 'wellPlacedCount' : 0, 'wrongEyeCount' : 0})
        else{
          if (tmp>distance+eps) this.setState({'indication' : "se rapprocher", 'color' : 'black', 'wellPlacedCount' : 0, 'wrongEyeCount' : 0})
          else this.setState({'indication' : "Parfait, ne bougez plus", 'color' : 'green', 'wellPlacedCount' : this.state.wellPlacedCount+1, 'wrongEyeCount' : 0})
        }
      }else{
        this.setState({'wrongEyeCount' : this.state.wrongEyeCount+1})
      }
    }
    else console.log("pas bon qr code")

    if (this.state.wrongEyeCount >= 4) this.setState({'indication' : "mauvais oeil", 'color' : 'black', 'wellPlacedCount' : 0})
    if (this.state.wellPlacedCount >= wellPlacedInaRow) this.setState({'indication' : "terminé", 'color' : 'blue'})
  }

  render() {
      const { navigation } = this.props;
      var img
      if (JSON.stringify(navigation.getParam('eye')) == '"left"') img = require('./img/imgleft.png')
      else img = require('./img/imgright.png')
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)
    return (
      <QRCodeScanner
        onRead={this.onSuccess}
        vibrate={false}
        reactivate={true} 
        showMarker={true}
        customMarker={<Image style={{width: 900, height: 900, marginTop: 160}} tintColor={this.state.color} source={ img } />}
        cameraType={'front'}
        bottomContent={
            <Text style={styles.buttonText}>{this.state.indication}</Text>
        }
      />
    );
  }
}
 
const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(255,255,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});
 
AppRegistry.registerComponent('default', () => ScanScreen);