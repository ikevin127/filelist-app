import React, {useState, useEffect} from 'react';
import Adjust from './AdjustText';
import AsyncStorage from '@react-native-community/async-storage';
import {Picker} from '@react-native-community/picker';
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
  faTextHeight,
  faCaretDown,
} from '@fortawesome/free-solid-svg-icons';

const MAIN_LIGHT = '#E8E6E6';
const MAIN_DARK = '#202020';
const ACCENT_COLOR = '#15ABF4';

export default function RightDrawer({navigation}) {
  const dispatch = useDispatch();
  const {lightTheme, fontSizes} = useSelector((state) => state.appConfig);
  const [darkLight] = useState(new Animated.Value(0));
  const [user, setUser] = useState('');
  const [firebasePic, setFirebasePic] = useState(false);
  const spinIt = darkLight.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['0deg', '180deg', '360deg'],
  });

  useEffect(() => {
    getCurrentUser();
    dispatch(AppConfigActions.setFonts());
  }, []);

  const toggleSFonts = async () => {
    try {
      await AsyncStorage.setItem(
        'fontSizes',
        JSON.stringify([4, 6, 8, 9, 10, 11, 12, 14, 20, 45]),
      );
      dispatch(AppConfigActions.setFonts());
    } catch (e) {
      crashlytics().recordError(e);
    }
  };

  const toggleMFonts = async () => {
    try {
      await AsyncStorage.setItem(
        'fontSizes',
        JSON.stringify([6, 8, 10, 11, 12, 13, 14, 16, 22, 50]),
      );
      dispatch(AppConfigActions.setFonts());
    } catch (e) {
      crashlytics().recordError(e);
    }
  };

  const toggleLFonts = async () => {
    try {
      await AsyncStorage.setItem(
        'fontSizes',
        JSON.stringify([8, 10, 12, 13, 14, 15, 16, 18, 24, 50]),
      );
      dispatch(AppConfigActions.setFonts());
    } catch (e) {
      crashlytics().recordError(e);
    }
  };

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
                borderColor: 'silver',
                backgroundColor: lightTheme ? MAIN_DARK : '#505050',
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
                  fontSize: Adjust(fontSizes !== null ? fontSizes[9] : 50),
                  color: 'white',
                  textShadowColor: lightTheme ? 'transparent' : MAIN_DARK,
                  textShadowRadius: 1,
                  textShadowOffset: {width: 0.8, height: 0.8},
                }}>
                {user !== '' ? user.charAt(0) : null}
              </Text>
            )}
          </View>
        </View>
        <View style={RightDrawerStyle.usernameView}>
          <Text
            style={{
              fontSize: Adjust(fontSizes !== null ? fontSizes[7] : 16),
              fontWeight: 'bold',
              color: lightTheme ? MAIN_DARK : 'white',
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
            size={Adjust(fontSizes !== null ? fontSizes[8] : 22)}
            icon={faInfoCircle}
          />
          <Text
            style={[
              RightDrawerStyle.settingsOverlayText,
              {
                fontSize: Adjust(fontSizes !== null ? fontSizes[6] : 14),
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
              size={Adjust(fontSizes !== null ? fontSizes[8] : 22)}
              icon={faAdjust}
            />
          </Animated.View>
          <Text
            style={[
              RightDrawerStyle.settingsOverlayText,
              {
                fontSize: Adjust(fontSizes !== null ? fontSizes[6] : 14),
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
      <View style={RightDrawerStyle.settingsOverlayFont}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingHorizontal: StatusBar.currentHeight / 1.5,
          }}>
          <FontAwesomeIcon
            color={lightTheme ? 'black' : MAIN_LIGHT}
            size={Adjust(fontSizes !== null ? fontSizes[8] : 22)}
            icon={faTextHeight}
          />
          <Text
            style={[
              RightDrawerStyle.settingsOverlayText,
              {
                fontSize: Adjust(fontSizes !== null ? fontSizes[6] : 14),
                color: lightTheme ? 'black' : 'white',
                textShadowColor: lightTheme ? 'transparent' : MAIN_DARK,
              },
            ]}>
            Mărime text
          </Text>
        </View>
        <Picker
          selectedValue={
            fontSizes !== null
              ? fontSizes[0] === 6
                ? 'm'
                : fontSizes[0] === 4
                ? 's'
                : fontSizes[0] === 8
                ? 'l'
                : 'm'
              : 'm'
          }
          style={[
            RightDrawerStyle.settingsPicker,
            {
              fontSize: Adjust(fontSizes !== null ? fontSizes[6] : 14),
              color: lightTheme ? 'black' : 'white',
            },
          ]}
          mode="dropdown"
          onValueChange={(itemValue) =>
            itemValue === 's'
              ? toggleSFonts()
              : itemValue === 'm'
              ? toggleMFonts()
              : itemValue === 'l'
              ? toggleLFonts()
              : null
          }>
          <Picker.Item label="Mic" value="s" />
          <Picker.Item label="Mediu" value="m" />
          <Picker.Item label="Mare" value="l" />
        </Picker>
        <FontAwesomeIcon
          style={[
            RightDrawerStyle.pickerIcon,
            {
              color: lightTheme ? MAIN_DARK : MAIN_LIGHT,
            },
          ]}
          size={Adjust(fontSizes !== null ? fontSizes[7] : 16)}
          icon={faCaretDown}
        />
      </View>
      <View style={RightDrawerStyle.settingOverlayFilelist}>
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
            size={Adjust(fontSizes !== null ? fontSizes[8] : 22)}
            icon={faLink}
          />
          <Text
            style={[
              RightDrawerStyle.settingsOverlayText,
              {
                fontSize: Adjust(fontSizes !== null ? fontSizes[6] : 14),
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
                fontSize: Adjust(fontSizes !== null ? fontSizes[6] : 14),
                color: lightTheme ? 'black' : 'white',
                textShadowColor: lightTheme ? 'transparent' : MAIN_DARK,
              },
            ]}>
            Logout
          </Text>
        </Pressable>
      </View>
      <View style={RightDrawerStyle.settingsOverlayVersion}>
        <Text
          style={[
            RightDrawerStyle.settingsOverlayVersionText,
            {
              fontSize: Adjust(8),
              color: 'grey',
              opacity: 0.5,
              textShadowColor: lightTheme ? 'transparent' : MAIN_DARK,
            },
          ]}>
          Filelist App v3.0.1
        </Text>
      </View>
    </View>
  );
}

const RightDrawerStyle = EStyleSheet.create({
  profileContainer: {
    flex: 1,
    marginTop: StatusBar.currentHeight * 1.5,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  profilePicContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  profilePicView: {
    width: '100rem',
    height: '100rem',
    borderRadius: 100,
    borderWidth: '2rem',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePic: {
    width: '100rem',
    height: '100rem',
    borderRadius: 100,
  },
  usernameView: {
    marginTop: StatusBar.currentHeight / 1.5,
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
  settingsOverlayVersion: {
    width: '100%',
    height: '18rem',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsOverlayVersionText: {
    textShadowOffset: {width: '0.5rem', height: '0.5rem'},
    textShadowRadius: '1rem',
  },
  settingsOverlayFont: {
    width: '100%',
    height: '75rem',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: StatusBar.currentHeight / 1.5,
  },
  settingOverlayFilelist: {
    width: '100%',
    height: '55rem',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsPicker: {
    width: '76%',
    marginTop: '8rem',
    backgroundColor: 'transparent',
  },
  pickerIcon: {position: 'absolute', bottom: '15rem', right: '42rem'},
});
