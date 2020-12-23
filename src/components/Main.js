import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import Auth from './Auth';

export default () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <NavigationContainer theme={{colors: {background: '#000'}}}>
      <Auth />
    </NavigationContainer>
  );
};
