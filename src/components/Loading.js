import React from 'react';
import {View, StatusBar, ActivityIndicator, Platform} from 'react-native';

// Redux
import {useSelector} from 'react-redux';

// Responsiveness
import EStyleSheet from 'react-native-extended-stylesheet';

// Variables
import {
  MAIN_LIGHT,
  ACCENT_COLOR,
} from '../assets/variables';

export default function Loading() {
  // Redux
  const {
    lightTheme,
  } = useSelector((state) => state.appConfig);
  
  return (
    <>
      <StatusBar
        barStyle={lightTheme ? 'dark-content' : 'light-content'}
        backgroundColor={
          lightTheme
            ? Platform.Version < 23
              ? 'black'
              : 'transparent'
            : 'transparent'
        }
        translucent={true}
      />
      <View
        style={[
          LoadingPage.container,
          {backgroundColor: lightTheme ? MAIN_LIGHT : 'black'},
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
