import React from 'react';
import {View, StatusBar, ActivityIndicator, Platform} from 'react-native';

// Responsiveness
import EStyleSheet from 'react-native-extended-stylesheet';

// Variables
import {
  ACCENT_COLOR,
} from '../assets/variables';

export default function Loading() {
  
  return (
    <>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={'black'}
        translucent={true}
      />
      <View
        style={[
          LoadingPage.container,
          {backgroundColor: 'black'},
        ]}>
        <ActivityIndicator
          style={LoadingPage.indicator}
          size={Platform.OS === 'ios' ? 'small' : 'large'}
          color={ACCENT_COLOR}
        />
      </View>
    </>
  );
}

const LoadingPage = EStyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    justifyContent: 'center',
  },
  indicator: {
    transform: [
      {
        scale: 1.5,
      },
    ],
  },
});
