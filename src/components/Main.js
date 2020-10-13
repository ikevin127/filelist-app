import React, {useEffect} from 'react';
import Auth from './Auth';
import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';

export default () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <NavigationContainer>
      <Auth />
    </NavigationContainer>
  );
};
