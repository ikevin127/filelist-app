import React, {useState, useEffect} from 'react';
import Adjust from './AdjustText';
import AsyncStorage from '@react-native-community/async-storage';
import FastImage from 'react-native-fast-image';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  Alert,
  Animated,
  Text,
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
  const [user, setUser] = useState('');
  const [firebasePic, setFirebasePic] = useState(false);
  const spinIt = darkLight.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['0deg', '180deg', '360deg'],
  });

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      const currentUser = await AsyncStorage.getItem('username');
      if (currentUser !== null) {
        setUser(currentUser);
      }
    } catch (e) {
      alert(e);
    }
  };

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
            toValue: 2,
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
      <View style={RightDrawerStyle.profileContainer}>
        <View style={RightDrawerStyle.profilePicContainer}>
          <View
            style={[
              RightDrawerStyle.profilePicView,
              {
                backgroundColor: lightTheme ? MAIN_DARK : MAIN_LIGHT,
              },
            ]}>
            {firebasePic ? (
              <FastImage
                style={RightDrawerStyle.profilePic}
                resizeMode={FastImage.resizeMode.contain}
                source={require('../assets/pass.png')}
              />
            ) : (
              <Text
                style={{
                  fontSize: Adjust(50),
                  color: lightTheme ? MAIN_LIGHT : MAIN_DARK,
                }}>
                {user !== '' ? user.charAt(0) : null}
              </Text>
            )}
          </View>
        </View>
        <View style={RightDrawerStyle.usernameView}>
          <Text
            style={{
              fontSize: Adjust(16),
              fontWeight: 'bold',
              color: lightTheme ? MAIN_DARK : MAIN_LIGHT,
            }}>
            {user !== '' ? user : null}
          </Text>
        </View>
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
            color={lightTheme ? MAIN_DARK : MAIN_LIGHT}
            size={Adjust(22)}
            icon={faInfoCircle}
          />
          <Text
            style={[
              RightDrawerStyle.settingsOverlayText,
              {
                fontSize: Adjust(14),
                color: lightTheme ? 'black' : 'white',
                textShadowColor: lightTheme ? 'transparent' : MAIN_DARK,
              },
            ]}>
            Informaţii folosire
          </Text>
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
          <Text
            style={[
              RightDrawerStyle.settingsOverlayText,
              {
                fontSize: Adjust(14),
                color: lightTheme ? 'black' : 'white',
                textShadowColor: lightTheme ? 'transparent' : MAIN_DARK,
              },
            ]}>
            Temă culori
          </Text>
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
            color={lightTheme ? MAIN_DARK : MAIN_LIGHT}
            size={Adjust(22)}
            icon={faLink}
          />
          <Text
            style={[
              RightDrawerStyle.settingsOverlayText,
              {
                fontSize: Adjust(14),
                color: lightTheme ? 'black' : 'white',
                textShadowColor: lightTheme ? 'transparent' : MAIN_DARK,
              },
            ]}>
            Filelist.io
          </Text>
        </Pressable>
      </View>
      <View style={RightDrawerStyle.settingsOverlayContainer}>
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
          <Text
            style={[
              RightDrawerStyle.settingsOverlayText,
              {
                fontSize: Adjust(14),
                color: lightTheme ? 'black' : 'white',
                textShadowColor: lightTheme ? 'transparent' : MAIN_DARK,
              },
            ]}>
            Logout
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const RightDrawerStyle = EStyleSheet.create({
  profileContainer: {
    width: '100%',
    height: '200rem',
    position: 'absolute',
    top: StatusBar.currentHeight * 1.5,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  profilePicContainer: {
    width: '100%',
    height: '80%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicView: {
    width: '130rem',
    height: '130rem',
    borderRadius: 100,
    borderColor: 'grey',
    borderWidth: '2rem',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePic: {
    width: '130rem',
    height: '130rem',
    borderRadius: 100,
  },
  usernameView: {
    width: '100%',
    height: '20%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  settingsOverlayMainContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  settingsOverlayContainer: {
    width: '100%',
    height: '55rem',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: StatusBar.currentHeight / 2,
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
