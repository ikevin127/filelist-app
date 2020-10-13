import React, {useEffect, useState} from 'react';
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
    if (!listLatest) {
      dispatch(AppConfigActions.retrieveLatest());
      setTimeout(() => {
        setLoading(false);
      }, 100);
    }
  }, []);

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
            animationTypeForReplace: 'pop',
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
