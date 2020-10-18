import React from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import {View, StatusBar, ActivityIndicator} from 'react-native';
import {useSelector} from 'react-redux';

const MAIN_LIGHT = '#E8E6E6';
const MAIN_DARK = '#202020';
const ACCENT_COLOR = '#15ABF4';

export default function Loading() {
  const {
    lightTheme,
  } = useSelector((state) => state.appConfig);
  return (
    <>
      <StatusBar
        barStyle={lightTheme ? 'dark-content':'light-content'}
        backgroundColor={'transparent'}
        translucent={true}
      />
      <View style={[LoadingPage.container, {backgroundColor: lightTheme ? MAIN_LIGHT : MAIN_DARK}]}>
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
  },
  indicator: {
    transform: [
      {
        scale: 1.5,
      },
    ],
  },
});
