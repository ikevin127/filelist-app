import React from 'react';
import Main from './src/components/Main';
import EStyleSheet from 'react-native-extended-stylesheet';
import 'react-native-gesture-handler';
import {Dimensions} from 'react-native';
import {Provider} from 'react-redux';
import {store} from './src/redux/configureStore';

let {width} = Dimensions.get('window');
EStyleSheet.build({$rem: width > 340 ? 18 : 16});
export default function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
