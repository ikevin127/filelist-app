import React from 'react';
import {Dimensions} from 'react-native';
import {Provider} from 'react-redux';
import {store} from './src/redux/configureStore';
import Main from './src/routes/Main';
import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';
enableScreens();
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 360});

export default function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
