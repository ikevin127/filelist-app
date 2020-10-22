import React, {useState} from 'react';
import RText from './Text';
import Adjust from './AdjustText';
import AsyncStorage from '@react-native-community/async-storage';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  Alert,
  Animated,
  View,
  Easing,
  Switch,
  Pressable,
  StatusBar,
  Linking,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppConfigActions} from '../redux/actions';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faAdjust,
  faSignOutAlt,
  faInfoCircle,
  faLink,
} from '@fortawesome/free-solid-svg-icons';

const MAIN_LIGHT = '#E8E6E6';
const MAIN_DARK = '#202020';
const ACCENT_COLOR = '#15ABF4';

export default function RightDrawer({navigation}) {
  const dispatch = useDispatch();
  const {lightTheme} = useSelector((state) => state.appConfig);
  const [darkLight] = useState(new Animated.Value(0));
  const spinIt = darkLight.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const switchTheme = async () => {
    try {
      const currentTheme = await AsyncStorage.getItem('theme');
      if (currentTheme !== null) {
        if (currentTheme === 'dark') {
          await AsyncStorage.setItem('theme', 'light');
          dispatch(AppConfigActions.toggleLightTheme());
          Animated.timing(darkLight, {
            toValue: 1,
            duration: 500,
            easing: Easing.cubic,
            useNativeDriver: true,
          }).start();
        } else {
          await AsyncStorage.setItem('theme', 'dark');
          dispatch(AppConfigActions.toggleLightTheme());
          Animated.timing(darkLight, {
            toValue: 0,
            duration: 500,
            easing: Easing.cubic,
            useNativeDriver: true,
          }).start();
        }
      } else {
        await AsyncStorage.setItem('theme', 'dark');
      }
    } catch (e) {
      alert(e);
    }
  };

  const handleLogout = async () => {
    const keys = ['username', 'passkey', 'latest'];
    try {
      await AsyncStorage.multiRemove(keys);
      dispatch(AppConfigActions.retrieveLatest());
      dispatch(AppConfigActions.latestError());
    } catch (e) {
      alert(e);
    }
  };

  return (
    <View
      style={[
        RightDrawerStyle.settingsOverlayMainContainer,
        {backgroundColor: lightTheme ? MAIN_LIGHT : MAIN_DARK},
      ]}>
      <View style={RightDrawerStyle.settingsOverlayContainer}>
        <Pressable
          style={RightDrawerStyle.settingsOverlayPressable}
          android_ripple={{
            color: 'grey',
            borderless: false,
          }}
          onPress={() =>
            Alert.alert(
              'Info',
              'Doreşti să părăseşti aplicaţia şi să navighezi spre Filelist ?',
              [
                {
                  text: 'Da',
                  onPress: () => Linking.openURL('https://filelist.io'),
                },
                {
                  text: 'Nu',
                  onPress: () => {},
                  style: 'cancel',
                },
              ],
              {cancelable: true},
            )
          }>
          <FontAwesomeIcon
            color={ACCENT_COLOR}
            size={Adjust(22)}
            icon={faLink}
          />
          <RText
            title={'Filelist.io'}
            t14
            style={[
              RightDrawerStyle.settingsOverlayText,
              {
                color: lightTheme ? 'black' : 'white',
                textShadowColor: lightTheme ? 'transparent' : MAIN_DARK,
              },
            ]}
          />
        </Pressable>
      </View>
      <View style={RightDrawerStyle.settingsOverlayContainer}>
        <Pressable
          style={RightDrawerStyle.settingsOverlayPressable}
          android_ripple={{
            color: 'grey',
            borderless: false,
          }}
          onPress={() => dispatch(AppConfigActions.toggleAppInfo())}>
          <FontAwesomeIcon
            color={'grey'}
            size={Adjust(22)}
            icon={faInfoCircle}
          />
          <RText
            title={'Informaţii folosire'}
            t14
            style={[
              RightDrawerStyle.settingsOverlayText,
              {
                color: lightTheme ? 'black' : 'white',
                textShadowColor: lightTheme ? 'transparent' : MAIN_DARK,
              },
            ]}
          />
        </Pressable>
      </View>
      <View style={RightDrawerStyle.settingsOverlayContainer}>
        <Pressable
          style={RightDrawerStyle.settingsOverlayPressable}
          android_ripple={{
            color: 'grey',
            borderless: false,
          }}
          onPress={() => switchTheme()}>
          <Animated.View
            style={{
              transform: [
                {
                  rotate: spinIt,
                },
              ],
            }}>
            <FontAwesomeIcon
              color={lightTheme ? 'black' : MAIN_LIGHT}
              size={Adjust(22)}
              icon={faAdjust}
            />
          </Animated.View>
          <RText
            title={'Temă culori'}
            t14
            style={[
              RightDrawerStyle.settingsOverlayText,
              {
                color: lightTheme ? 'black' : 'white',
                textShadowColor: lightTheme ? 'transparent' : MAIN_DARK,
              },
            ]}
          />
          <View
            style={{
              position: 'absolute',
              right: 0,
              paddingRight: StatusBar.currentHeight,
            }}
            pointerEvents={'none'}>
            <Switch
              trackColor={{false: 'grey', true: MAIN_LIGHT}}
              thumbColor={lightTheme ? 'white' : 'black'}
              ios_backgroundColor="#909090"
              value={!lightTheme}
            />
          </View>
        </Pressable>
      </View>
      <View
        style={[
          RightDrawerStyle.settingsOverlayContainer,
          {position: 'absolute', bottom: 0},
        ]}>
        <Pressable
          style={RightDrawerStyle.settingsOverlayPressable}
          android_ripple={{
            color: 'grey',
            borderless: false,
          }}
          onPress={() => {
            navigation.closeDrawer();
            handleLogout();
          }}>
          <FontAwesomeIcon
            style={{
              transform: [
                {
                  rotate: darkLight === 0 ? '0deg' : '0deg',
                },
              ],
            }}
            color={'crimson'}
            size={Adjust(25)}
            icon={faSignOutAlt}
          />
          <RText
            title={'Logout'}
            t14
            style={[
              RightDrawerStyle.settingsOverlayText,
              {
                color: lightTheme ? 'black' : 'white',
                textShadowColor: lightTheme ? 'transparent' : MAIN_DARK,
              },
            ]}
          />
        </Pressable>
      </View>
    </View>
  );
}

const RightDrawerStyle = EStyleSheet.create({
  settingsOverlayMainContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: StatusBar.currentHeight / 2,
  },
  settingsOverlayContainer: {
    width: '100%',
    height: '50rem',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: StatusBar.currentHeight / 2,
  },
  settingsOverlayPressable: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: StatusBar.currentHeight / 1.5,
  },
  settingsOverlayText: {
    textShadowOffset: {width: '0.5rem', height: '0.5rem'},
    textShadowRadius: '1rem',
    fontWeight: 'bold',
    marginLeft: StatusBar.currentHeight / 1.5,
  },
});
