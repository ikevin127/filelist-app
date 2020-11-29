import React, {useState, useEffect} from 'react';
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
import {Picker} from '@react-native-picker/picker';
import crashlytics from '@react-native-firebase/crashlytics';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Redux
import {useDispatch, useSelector} from 'react-redux';
import {AppConfigActions} from '../redux/actions';

// Responsiveness
import Adjust from './AdjustText';
import EStyleSheet from 'react-native-extended-stylesheet';

// Icons
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faAdjust,
  faSignOutAlt,
  faInfoCircle,
  faDirections,
  faTextHeight,
  faCaretDown,
} from '@fortawesome/free-solid-svg-icons';

// Variables
import {
  width,
  MAIN_LIGHT,
} from '../assets/variables';

export default function RightDrawer({navigation}) {
  const [user, setUser] = useState('');
  const [darkLight] = useState(new Animated.Value(0));

  // Redux
  const dispatch = useDispatch();
  const {lightTheme, fontSizes} = useSelector((state) => state.appConfig);


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
      crashlytics().log('rightdrawer -> toggleSFonts()');
      crashlytics().recordError(e);
    }
  };

  const toggleMFonts = async () => {
    try {
      await AsyncStorage.setItem(
        'fontSizes',
        JSON.stringify([6, 9, 10, 11, 12, 13, 14, 16, 22, 50]),
      );
      dispatch(AppConfigActions.setFonts());
    } catch (e) {
      crashlytics().log('rightdrawer -> toggleMFonts()');
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
      crashlytics().log('rightdrawer -> toggleLFonts()');
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
        {backgroundColor: lightTheme ? MAIN_LIGHT : 'black'},
      ]}>
      <View style={RightDrawerStyle.profileContainer}>
        <View style={RightDrawerStyle.profilePicContainer}>
          <View
            style={[
              RightDrawerStyle.profilePicView,
              {borderColor: lightTheme ? 'black' : MAIN_LIGHT},
            ]}>
            <Text
              style={{
                fontSize: Adjust(30),
                fontWeight: 'bold',
                color: lightTheme ? 'black' : 'white',
              }}>
              {user !== '' ? user.charAt(0) : null}
            </Text>
          </View>
        </View>
        <View style={RightDrawerStyle.usernameView}>
          <Text
            style={{
              fontSize: Adjust(fontSizes !== null ? fontSizes[7] : 16),
              fontWeight: 'bold',
              color: lightTheme ? 'black' : 'white',
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
            color={lightTheme ? 'black' : MAIN_LIGHT}
            size={Adjust(fontSizes !== null ? fontSizes[8] : 22)}
            icon={faInfoCircle}
          />
          <Text
            style={[
              RightDrawerStyle.settingsOverlayText,
              {
                fontSize: Adjust(fontSizes !== null ? fontSizes[6] : 14),
                color: lightTheme ? 'black' : 'white',
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
              },
            ]}>
            Temă culori
          </Text>
          <View
            style={{
              paddingLeft: StatusBar.currentHeight,
            }}
            pointerEvents={'none'}>
            <Switch
              trackColor={{false: 'black', true: '#505050'}}
              thumbColor={lightTheme ? 'white' : MAIN_LIGHT}
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
              },
            ]}>
            Dimensiune text
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
              color: lightTheme ? 'black' : MAIN_LIGHT,
            },
          ]}
          size={Adjust(fontSizes !== null ? fontSizes[7] : 16)}
          icon={faCaretDown}
        />
      </View>
      <View style={RightDrawerStyle.settingsOverlayContainer}>
        <Pressable
          style={RightDrawerStyle.settingsOverlayPressable}
          android_ripple={{
            color: 'grey',
            borderless: false,
          }}
          onPress={async () => {
            const supported = await Linking.canOpenURL('https://filelist.io');
            if (supported) {
              Alert.alert(
                'Info',
                'Doreşti să navighezi spre Filelist.io ?',
                [
                  {
                    text: 'DA',
                    onPress: () => Linking.openURL('https://filelist.io'),
                  },
                  {
                    text: 'NU',
                    onPress: () => {},
                    style: 'cancel',
                  },
                ],
                {cancelable: true},
              );
            } else {
              Alert.alert(
                'Info',
                'Navigarea spre Filelist.io nu a funcţionat.',
                [
                  {
                    text: 'OK',
                    onPress: () => {},
                    style: 'cancel',
                  },
                ],
                {cancelable: true},
              );
            }
          }}>
          <FontAwesomeIcon
            color={lightTheme ? 'black' : MAIN_LIGHT}
            size={Adjust(fontSizes !== null ? fontSizes[8] : 22)}
            icon={faDirections}
          />
          <Text
            style={[
              RightDrawerStyle.settingsOverlayText,
              {
                fontSize: Adjust(fontSizes !== null ? fontSizes[6] : 14),
                color: lightTheme ? 'black' : 'white',
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
    top: 0,
    width: '100%',
    height: width / 2,
    position: 'absolute',
    paddingTop: StatusBar.currentHeight,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  profilePicContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicView: {
    width: width / 5,
    height: width / 5,
    backgroundColor: 'transparent',
    borderRadius: 100,
    borderWidth: 1.5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: '0.3rem',
  },
  usernameView: {
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
    height: width / 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '0.5rem',
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
    fontWeight: 'bold',
    marginLeft: StatusBar.currentHeight / 1.5,
  },
  settingsOverlayFont: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: StatusBar.currentHeight / 1.5,
  },
  settingsPicker: {
    position: 'relative',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '70%',
    marginTop: '1rem',
    backgroundColor: 'transparent',
  },
  pickerIcon: {position: 'absolute', bottom: '0.9rem', right: '5rem'},
});
