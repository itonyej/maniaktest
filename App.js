/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import { navigationRef } from './src/components/commons/NavigationService';
import * as NavigationService from './src/components/commons/NavigationService';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import FlashMessage from "react-native-flash-message";

//COMPONENTES
import AppBar from "./src/components/commons/AppBar";

//PAGINAS
import LoginScreen from './src/components/pages/LoginScreen/LoginScreen';
import HomeScreen from './src/components/pages/HomeScreen/HomeScreen';

//VARIABLES GLOBALES
const Stack = createStackNavigator();

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      dataToken:"",
      dataTokenSet:false,
      login: false,
    }
  }

  componentDidMount() {
    this.checkSession();
  }

  //SE COMPRUEBA SI YA SE INICIO SESION EN LA APP...
  checkSession = async () => {
    try {
      const that = this;
      const data = await AsyncStorage.multiGet(['login', 'dataToken', 'page']);
      if (data !== null) {
        var login = JSON.parse(data[0][1]);
        var dataToken =  data[1][1];
        var page = data[2][1];
        //SI YA SE INICIO SESION...
        if(login === true) {
          this.setState({login:true, dataToken:dataToken, page:page, dataUserSet:true},() => {
            setTimeout(function () {
              //REDIRIGIMOS  LA PAGINA HOME
              that.handleNavigation(page);
            },100);
          })
        }
      }
    } catch (error) {}
  };

  //MANEJADOR PARA INICIAR SESION
  handleLogin = (dataToken) => {
    const self = this;
    this.setState({dataToken: dataToken, login: true, dataTokenSet:true}, () => {
      AsyncStorage.multiSet([['login', JSON.stringify(true)],['dataToken', dataToken]], ()=> {
        NavigationService.navigate('Home');
      });
    });
  }

  //MANEJADOR PARA CERRARSESION
  handleCloseSession = () => {
    this.setState({dataToken: "", login: false, dataUserSet:false}, () => {
      AsyncStorage.multiSet([['login', JSON.stringify(false)],['dataToken', '']], ()=> {
        NavigationService.navigate('Login');
      });
    });
  }

  //MANEJADOR DE LOS EVENTOS DE NAVEGACION
  handleEventNavigation = (state) => {
    var newPage = state.routes[state.index].name
    AsyncStorage.setItem('page', newPage, ()=> {
      this.setState({page: newPage});
    });
  }

  //MANEJADOR DE NAVEGACION
  handleNavigation = (newPage, data) => {
    const {page} = this.state;
    NavigationService.navigate(newPage);
  }

  //MANEJADOR PARA NAVEGAR HACIA ATRAS
  handleNavigationGoBack = () => {
    NavigationService.goBack();
  }

  render() {
    const {login, dataToken} = this.state;
    const animation = TransitionPresets.SlideFromRightIOS;

    //APBAR
    const appBar = <AppBar
      handleNavigationGoBack={this.handleNavigationGoBack}
      handleNavigation={this.handleNavigation}
      handleCloseSession={this.handleCloseSession}
    />

    return (
      <>
        <SafeAreaProvider>
        <StatusBar backgroundColor="#1e1f23" barStyle="light-content" />
          <NavigationContainer
            ref={navigationRef}
            onStateChange={state => this.handleEventNavigation(state)}
          >
            <Stack.Navigator
              headerMode="none"
              screenOptions={{
                cardStyle: {backgroundColor:'transparent'}
              }}
            >
              {!login ? (
                <Stack.Screen
                  name="Login">
                  {props =>
                    <LoginScreen
                      {...props}
                      appBar={appBar}
                      handleLogin={this.handleLogin}
                    />
                  }
                </Stack.Screen>
              ) : (
                <>
                  <Stack.Screen
                    name="Home">
                    {props =>
                      <HomeScreen
                        {...props}
                        appBar={appBar}
                        dataToken={dataToken}
                      />
                    }
                  </Stack.Screen>
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
        <FlashMessage position="top" />
      </>
    )
  }
}

export default App;
