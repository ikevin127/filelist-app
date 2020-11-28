import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Redux
import {useDispatch, useSelector} from 'react-redux';
import {AppConfigActions} from '../redux/actions';

// Screens
import Loading from './Loading';
import Login from './Login';
import Home from './Home';
import RightDrawer from './RightDrawer';

// Variables
import {
  MAIN_LIGHT,
} from '../assets/variables';

// Navigation
import {createDrawerNavigator} from '@react-navigation/drawer';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Left drawer
const RightDrawerHome = ({navigation}) => {
  return (
    <Drawer.Navigator
      drawerPosition="left"
      backBehavior="history"
      drawerStyle={{width: '70%'}}
      drawerContent={(props) => <RightDrawer {...props} />}>
      <Drawer.Screen name="Home" component={Home} />
    </Drawer.Navigator>
  );
};

export default function Auth() {
  const [loading, setLoading] = useState(true);

  // Redux
  const dispatch = useDispatch();
  const {listLatest} = useSelector((state) => state.appConfig);

  // Component mount
  useEffect(() => {
    establishTheme();
    if (!listLatest) {
      dispatch(AppConfigActions.retrieveLatest());
      setTimeout(() => {
        setLoading(false);
      }, 100);
    }
  }, []);

  // Functions
  const establishTheme = async () => {
    try {
      const currentTheme = await AsyncStorage.getItem('theme');
      if (currentTheme !== null) {
        if (currentTheme === 'light') {
          dispatch(AppConfigActions.toggleLightTheme());
        } else {
          //
        }
      } else {
        await AsyncStorage.setItem('theme', 'dark');
      }
    } catch (e) {
      alert(e);
    }
  };

  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
        cardStyle: {backgroundColor: MAIN_LIGHT},
      }}
      headerMode="none">
      {listLatest ? (
        <Stack.Screen
          name="RightDrawerHome"
          component={RightDrawerHome}
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
