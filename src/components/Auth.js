import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import Loading from './Loading';
import Login from './Login';
import Home from './Home';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {useDispatch, useSelector} from 'react-redux';
import {AppConfigActions} from '../redux/actions';

const MAIN_LIGHT = '#E8E6E6';
const Stack = createStackNavigator();

export default function Auth() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const {listLatest} = useSelector((state) => state.appConfig);

  useEffect(() => {
    establishTheme();
    if (!listLatest) {
      dispatch(AppConfigActions.retrieveLatest());
      setTimeout(() => {
        setLoading(false);
      }, 100);
    }
  }, []);

  const establishTheme = async () => {
    try {
      const currentTheme = await AsyncStorage.getItem('theme');
      if (currentTheme !== null) {
        if (currentTheme === 'light') {
          dispatch(AppConfigActions.toggleLightTheme())
        } else {
          // do notin'
        }
      } else {
        await AsyncStorage.setItem('theme', 'dark');
      }
    } catch (e) {
      alert(e);
    }
  }

  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
        cardStyle: {backgroundColor: MAIN_LIGHT},
      }}
      headerMode="none">
      {listLatest ? (
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            animationTypeForReplace: 'push',
          }}
        />
      ) : loading ? (
        <Stack.Screen
          name="Loading"
          component={Loading}
          options={{
            animationTypeForReplace: 'pop',
            cardStyle: {backgroundColor: 'white'},
          }}
        />
      ) : (
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            animationTypeForReplace: 'push',
            cardStyle: {backgroundColor: 'white'},
          }}
        />
      )}
    </Stack.Navigator>
  );
}
