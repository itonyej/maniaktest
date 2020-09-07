import React from 'react';
import {SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar} from 'react-native';
import axios from 'axios';
import LinearGradient from "react-native-linear-gradient";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {TextField, Icon, Button, Dialog, IconButton} from 'material-bread';
import { showMessage, hideMessage } from "react-native-flash-message";
import {hp, wp} from '../../commons/StylesFunctions';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imagesData:[]
    }
  }

  componentDidMount() {
    this.getImagesApi();
  }

  getImagesApi = () => {
    const that = this;
    const {dataToken} = this.props;
    const config = {
      headers: { Authorization: `Bearer ${dataToken}` }
    };

    showMessage({
      autoHide:false,
      backgroundColor: "#0345EA",
      message: "Cargando...",
      type: "info",
      icon: "info",
      titleStyle: {ontSize: 15},
      position:"bottom"
    });

    axios.get('https://challenge.maniak.co/api/images', config
    ).then(function (response) {
      var data = response.data;
      hideMessage();
      that.setState({imagesData:data});
    }).catch(function (error) {
      that.setState({loading: false, disableBtn:false});
      var e = JSON.parse(JSON.stringify(error));
      var eText = e.message;
      if (eText === "Network Error") {
        eText = "Error de conexión."
      }
      showMessage({
        message: eText,
        type: "danger",
        icon: "danger",
        titleStyle: {fontSize: 15},
        position:"bottom"
      });
    });
  }

  render() {
    const {appBar} = this.props;
    const {imagesData} = this.state;

    return (
      <LinearGradient colors={['#282363', '#19163c', '#110f29']} style={{ flex:1 }}>
        <SafeAreaView>
          {appBar}
          <ScrollView contentInsetAdjustmentBehavior="automatic">
            <View style={[styles.viewContainerApp, {minHeight:'auto'}]}>
              {Object.keys(imagesData).length > 0 &&
                <>
                <View style={[styles.viewContentApp, {marginTop:0}]}>
                  <Text
                    style={styles.mediumLabel}
                  >
                    Images:
                  </Text>
                </View>
                <View style={[styles.viewContentApp, {marginTop:20}]}>
                  {imagesData.map(function (arr, index) {
                    return(
                      <View style={{
                        width:'100%',
                        borderWidth:0,
                        borderColor:'#fff',
                        marginBottom:20
                      }}>
                        <View style={{
                          width:'100%',
                          alignItems: 'center',
                          alignContent:'center'
                        }}>
                          <Text style={{color:'#FFF', fontSize:20, marginBottom:10}}>
                            Title: {arr.title}
                          </Text>
                          <Image
                            source={{ uri: arr.image }}
                            indicator={ProgressBar}
                            style={{
                              width: 320,
                              height: 240,
                            }}/>
                        </View>
                        <Text style={{color:'#FFF', fontSize:17, marginTop: 10}}>
                          Description: {arr.description}
                        </Text>
                      </View>
                    )
                  })}
                </View>
                </>
              }
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  mediumLabel: {
    color: '#FFF',
    fontSize: 18,
    lineHeight: 30,
  },
  viewContainerApp: {
    borderWidth: 0,
    borderColor: '#FFF',
    flex: 1,
    width: wp(100),
    minHeight: hp(86),
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  },
  viewContentApp: {
    borderWidth: 0,
    borderColor: '#FFF',
    marginTop: hp(2),
    width: '100%',
  },
});

export default HomeScreen;
