import React from 'react';
import Main from './src/components/Main';
import EStyleSheet from 'react-native-extended-stylesheet';
import 'react-native-gesture-handler';
import {Dimensions, LogBox} from 'react-native';
import {Provider} from 'react-redux';
import {store} from './src/redux/configureStore';
import {enableScreens} from 'react-native-screens';
enableScreens();
LogBox.ignoreLogs(['Require cycle:', 'Please report:']);

let {width} = Dimensions.get('window');
EStyleSheet.build({$rem: width > 340 ? 18 : 16});
export default function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
