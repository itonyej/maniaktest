import React, { useState, useEffect} from 'react';
import {View, Image, Text, StyleSheet, AsyncStorage} from 'react-native';
import { Appbar, Badge, IconButton,  Menu, MenuItem, Button } from 'material-bread';
import {useRoute} from '@react-navigation/native';

function AppBar (props) {
  const {handleCloseSession, dataUser, handleNavigationGoBack, handleNavigation} = props;
  const bg = 'transparent';

  function getTitle() {
    const route = useRoute();
    var page = route.name;
    var title = <Text style={styles.title}>Login</Text>
    if(page === "Home") {
      title = <Text style={styles.titleCard}>Home</Text>
    }
    return title;
  }

  function getActions() {
    const route = useRoute();
    var page = route.name;
    var actionItems = [
      {name: 'lock-open', onPress: () => handleCloseSession()},
    ]
    if(page === "Login") {
      actionItems = [];
    }
    return actionItems;
  }

  return (
    <Appbar
      title={getTitle()}
      style={{backgroundColor:bg, borderRadius:0, elevation:0}}
      actionItems={getActions()}
    >
    </Appbar>
  );

}

const styles = StyleSheet.create({
  title: {
    fontSize:22,
    color:'#FFF'
  },
  subTitle: {
    fontSize:12,
    color:'#FFF'
  },
  titleCard: {
    fontSize:17,
    color:'#FFF'
  },
})

export default AppBar
