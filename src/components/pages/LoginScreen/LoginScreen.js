import React from 'react';
import {SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar} from 'react-native';
import axios from 'axios';
import LinearGradient from "react-native-linear-gradient";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {TextField, Icon, Button, Dialog, IconButton} from 'material-bread';
import { showMessage, hideMessage } from "react-native-flash-message";
import {hp, wp} from '../../commons/StylesFunctions';

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailE:false,
      email:"",
      visibility:false,
      passE:false,
      pass:"",
      disableBtn:false,
      loading:false,
    }
  }

  login = () => {
    const that = this;
    const {handleLogin} = this.props;
    const {email, pass} = this.state;
    if(email === "") {
      showMessage({
        message: "Ingresa tu email.",
        type: "warning",
        icon: "warning",
        titleStyle: {fontSize: 15},
        position:"bottom"
      });
    } else if(pass === "") {
      showMessage({
        message: "Ingresa tu contraseña.",
        type: "warning",
        icon: "warning",
        position:"bottom"
      });
    } else {
      this.setState({loading:true, disableBtn:true}, () => {
        axios.post('https://challenge.maniak.co/api/login', {
          username: email,
          password: pass
        }, {
          headers: {'Content-Type': 'application/json'}
        }).then(function (response) {
          var data = response.data;
          that.setState({loading:false, disableBtn:false}, () => {
            console.log(data.token);
            handleLogin(data.token);
          })
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
      });
    }
  }

  render() {
    const {appBar} = this.props;
    const {emailE, email, visibility, passE, pass, disableBtn, loading} = this.state;
    return (
      <LinearGradient colors={['#282363', '#19163c', '#110f29']} style={{ flex:1 }}>
        <SafeAreaView>
          {appBar}
          <KeyboardAwareScrollView>
            <View style={styles.viewContainerLogin}>
              <View style={styles.viewFormLogin}>
                <Text
                  style={styles.bigLabel}
                >
                  Email
                </Text>
                <TextField
                  focused={true}
                  error={emailE}
                  type={'outlined'}
                  value={email}
                  autoCapitalize="none"
                  onChangeText={value => this.setState({ email: value, emailE:false })}
                  containerStyle={styles.inputContainer}
                  style={[styles.input, {color:'#000'}]}
                  selectionColor={"#eabb2a"}
                />
              </View>
              <View style={[styles.viewFormLogin, {marginTop:20}]}>
                <Text
                  style={styles.bigLabel}
                >
                  Password
                </Text>
                <TextField
                  focused={true}
                  error={passE}
                  type={'outlined'}
                  value={pass}
                  autoCapitalize="none"
                  onChangeText={value => this.setState({ pass: value, passE:false })}
                  containerStyle={styles.inputContainer}
                  style={[styles.input, {color:'#000'}]}
                  selectionColor={"#eabb2a"}
                  secureTextEntry={!visibility ? true : false}
                  trailingIcon={
                    visibility === false ?
                      <IconButton name="visibility-off" size={20} color={'#FFF'} onPress={()=>this.setState({visibility:true})}/>
                      :
                      <IconButton name="visibility" size={20} color={'#FFF'} onPress={()=>this.setState({visibility:false})}/>
                  }
                />
              </View>
              <View style={styles.viewFormBtnsNext}>
                <Button
                  disabled={disableBtn}
                  fullWidth={false}
                  text={'LOGIN'}
                  textColor={'#000'}
                  type="flat"
                  radius={30}
                  style={styles.btnCrear}
                  textStyle={styles.btnCrearText}
                  icon={<Icon name="arrow-forward" />}
                  iconPosition="right"
                  loading={loading}
                  onPress={()=>this.login()}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  btnCrear: {
    marginTop: 10,
    backgroundColor: '#eabb2a',
    height: 50,
    borderWidth: 0,
    width: 200,
  },
  btnCrearText: {
    fontSize: 16,
    textTransform: 'none',
    color: '#000',
  },
  bigLabel: {
    color: '#FFF',
    fontSize: 25,
    lineHeight: 30,
  },
  input: {
    color: '#FFF',
    fontSize: 20,
    borderWidth: 0,
  },
  inputContainer: {
    marginTop: 5,
    backgroundColor: 'rgba(255,255,255,.5)',
    borderRadius: 8,
    borderColor: 'rgba(255,255,255,.5)',
  },
  viewContainerLogin: {
    borderWidth: 0,
    borderColor: '#FFF',
    flex: 1,
    width: wp(100),
    height: hp(86),
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  },
  viewTxtLogin: {
    borderWidth: 0,
    borderColor: '#FFF',
    textAlign: 'center',
    marginTop: hp(10),
    width: '100%',
  },
  viewFormLogin: {
    borderWidth: 0,
    borderColor: '#FFF',
    marginTop: hp(2),
    width: '100%',
  },
  viewFormBtnsNext: {
    borderWidth: 0,
    borderColor: '#FFF',
    marginTop: hp(2),
  },
  textLogin: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 22,
    lineHeight: 25,
    width: '100%',
  },
});

export default LoginScreen;
