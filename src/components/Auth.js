/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {statusHeight} from '../assets/variables';
// Redux
import {useDispatch, useSelector} from 'react-redux';
import {AppConfigActions} from '../redux/actions';
// Screens
import LeftDrawerComponent from './LeftDrawer';
import TrailerView from './TrailerView';
import Settings from './Settings';
import Loading from './Loading';
import Search from './Search';
import Login from './Login';
import IMDb from './IMDb';
import Home from './Home';
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
      cardStyle={{opacity: 1}}
      animationEnabled={true}
      lazy
      keyboardDismissMode={'on-drag'}
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

const LeftDrawer = () => {
  return (
    <Drawer.Navigator
      drawerPosition="left"
      backBehavior="history"
      drawerStyle={{
        width: '70%',
        backgroundColor: 'black',
        marginTop: statusHeight * 3.5,
      }}
      overlayColor={'transparent'}
      drawerContent={(props) => <LeftDrawerComponent {...props} />}>
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
    // Set language, theme, autoplay & font sizes
    setLang();
    setTheme();
    setAutoplay();
    dispatch(AppConfigActions.setFonts());
    // if latestList !== null && app restart => send user to home
    if (listLatest === null) {
      dispatch(AppConfigActions.retrieveLatest());
      setTimeout(() => {
        setLoading(false);
      }, 100);
    }
    // eslint-disable-next-line  react-hooks/exhaustive-deps
  }, []);

  // Functions
  const setLang = async () => {
    const currentLang = await AsyncStorage.getItem('enLang');
    if (currentLang !== null) {
      if (currentLang === 'true') {
        dispatch(AppConfigActions.toggleEnLang());
      }
    } else {
      await AsyncStorage.setItem('enLang', 'false');
    }
  };
  const setTheme = async () => {
    const currentTheme = await AsyncStorage.getItem('theme');
    if (currentTheme !== null) {
      if (currentTheme === 'light') {
        dispatch(AppConfigActions.toggleLightTheme());
      }
    } else {
      await AsyncStorage.setItem('theme', 'dark');
    }
  };
  const setAutoplay = async () => {
    const currentAutoplay = await AsyncStorage.getItem('autoplay');
    if (currentAutoplay !== null) {
      if (currentAutoplay !== 'true') {
        await AsyncStorage.setItem('autoplay', 'false');
        dispatch(AppConfigActions.toggleAutoplay());
      }
    } else {
      await AsyncStorage.setItem('autoplay', 'true');
    }
  };

  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        cardStyle: {backgroundColor: 'black'},
      }}
      headerMode="none">
      {listLatest !== null ? (
        <>
          <Stack.Screen name="LeftDrawer" component={LeftDrawer} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="Trailer" component={TrailerView} />
          <Stack.Screen name="IMDb" component={IMDb} />
        </>
      ) : loading ? (
        <Stack.Screen name="Loading" component={Loading} />
      ) : (
        <Stack.Screen name="Login" component={Login} />
      )}
    </Stack.Navigator>
  );
}
