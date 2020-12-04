import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import crashlytics from '@react-native-firebase/crashlytics';

// Redux
import {useDispatch, useSelector} from 'react-redux';
import {AppConfigActions} from '../redux/actions';

// Screens
import RightDrawer from './RightDrawer';
import Loading from './Loading';
import Search from './Search';
import Login from './Login';
import Home from './Home';

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
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      animationEnabled={true}
      lazy={true}
      tabBarOptions={{
        showLabel: false,
        showIcon: false,
        style: {height: 0},
      }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Search} />
    </Tab.Navigator>
  );
}

// Left drawer
const RightDrawerHome = () => {
  return (
    <Drawer.Navigator
      drawerPosition="left"
      backBehavior="history"
      drawerStyle={{width: '70%'}}
      drawerContent={(props) => <RightDrawer {...props} />}>
      <Drawer.Screen name="Tabs" component={MyTabs} />
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
         }
      } else {
        await AsyncStorage.setItem('theme', 'dark');
      }
    } catch (e) {
      crashlytics().log('auth -> establishTheme()');
      crashlytics().recordError(e);
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
