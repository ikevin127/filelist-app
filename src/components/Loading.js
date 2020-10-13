import React from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import {View, StatusBar, ActivityIndicator} from 'react-native';

const MAIN_LIGHT = '#E8E6E6';
const MAIN_DARK = '#202020';
const ACCENT_COLOR = '#15ABF4';

export default function Loading() {
  return (
    <>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={'transparent'}
        translucent={true}
      />
      <View style={LoadingPage.container}>
        <ActivityIndicator
          style={LoadingPage.indicator}
          size="large"
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
    backgroundColor: MAIN_DARK,
  },
  indicator: {
    transform: [
      {
        scale: 1.5,
      },
    ],
  },
});
