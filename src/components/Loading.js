/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, StatusBar, ActivityIndicator, Platform} from 'react-native';
// Redux
import {useSelector} from 'react-redux';
// Variables
import {ACCENT_COLOR, MAIN_LIGHT} from '../assets/variables';

export default function Loading() {
  const {lightTheme} = useSelector((state) => state.appConfig);
  return (
    <>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={'transparent'}
        translucent={true}
      />
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: lightTheme ? MAIN_LIGHT : 'black',
        }}>
        <ActivityIndicator
          size={Platform.OS === 'ios' ? 'small' : 'large'}
          color={ACCENT_COLOR}
        />
      </View>
    </>
  );
}
