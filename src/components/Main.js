import React, { useState, useEffect } from 'react';
import { Platform, View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Redux
import { useDispatch, useSelector } from 'react-redux';
import { AppConfigActions } from '../redux/actions';
// Screens
import Menu from './Menu';
import TrailerView from './TrailerView';
import FilelistView from './FilelistView';
import Loading from './Loading';
import Search from './Search';
import Login from './Login';
import IMDb from './IMDb';
import HowTo from './HowTo';
import Home from './Home';
import LoginTest from './LoginTest';
import HomeTest from './HomeTest';
// Navigation
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';

const Stack = createStackNavigator();

function Auth() {
  const [loading, setLoading] = useState(true);
  // Redux
  const dispatch = useDispatch();
  const { listLatest, testLogin, variables } = useSelector((state) => state.appConfig);
  // Component mount
  useEffect(() => {
    // Get app variables
    dispatch(AppConfigActions.getVariables());
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

  const returnMainStack = () => {
    return listLatest !== null ? (
      <>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="HowTo" component={HowTo} />
        <Stack.Screen name="IMDb" component={IMDb} />
        <Stack.Screen name="Trailer" component={TrailerView} />
        <Stack.Screen name="Filelist" component={FilelistView} />
      </>
    ) : returnLoadingLogin();
  };

  const returnLoadingLogin = () => {
    return loading ? (
      <Stack.Screen name="Loading" component={Loading} />
    ) : (
      <Stack.Screen name="Login" component={Login} />
    );
  };

  const returnTestLogin = () => {
    return testLogin ? (
      <Stack.Screen name="HomeTest" component={HomeTest} />
    ) : (
      <Stack.Screen name="LoginTest" component={LoginTest} />
    );
  };

  const { IOS_REVIEW_TEST } = variables || {};

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <Stack.Navigator
        screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          presentation: 'modal',
        }}
        headerMode="none">
        {Platform.OS === "ios" && IOS_REVIEW_TEST ?
          returnTestLogin()
          : returnMainStack()}
      </Stack.Navigator>
    </View>
  );
}

export default () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <NavigationContainer theme={{ colors: { background: '#000' } }}>
      <Auth />
    </NavigationContainer>
  );
};
