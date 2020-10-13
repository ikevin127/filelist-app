import React from 'react';
import Main from './src/components/Main';
import EStyleSheet from 'react-native-extended-stylesheet';
import 'react-native-gesture-handler';
import {Dimensions} from 'react-native';
import {Provider} from 'react-redux';
import {store} from './src/redux/configureStore';
import {enableScreens} from 'react-native-screens';
enableScreens();

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 360});

export default function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
