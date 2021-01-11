/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  Alert,
  Animated,
  Text,
  View,
  Easing,
  ScrollView,
  Switch,
  Pressable,
  Platform,
  Linking,
} from 'react-native';
import {Picker, PickerIOS} from '@react-native-picker/picker';
import FastImage from 'react-native-fast-image';
import Accordion from 'react-native-collapsible/Accordion';
import {Overlay} from 'react-native-elements';
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
  faCheck,
  faSignOutAlt,
  faInfoCircle,
  faDirections,
  faTextHeight,
} from '@fortawesome/free-solid-svg-icons';
import ro from '../assets/ro.png';
import en from '../assets/en.png';

// Variables
import {
  width,
  height,
  statusHeight,
  MAIN_LIGHT,
  ACCENT_COLOR,
} from '../assets/variables';
import {RO, EN} from '../assets/lang';

export default function RightDrawer({navigation}) {
  const [user, setUser] = useState('');
  const [activeSections, setActiveSections] = useState([]);
  const [roEn] = useState(new Animated.Value(1));
  const [darkLight] = useState(new Animated.Value(0));
  const spinIt = darkLight.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['0deg', '180deg', '360deg'],
  });
  const bounceIt = roEn.interpolate({
    inputRange: [0, 1],
    outputRange: [1.1, 1],
  });

  // Redux
  const dispatch = useDispatch();
  const {appInfo, lightTheme, fontSizes, enLang} = useSelector(
    (state) => state.appConfig,
  );

  const INFO = [
    {
      title: enLang ? EN.infoT1 : RO.infoT1,
      content: enLang ? EN.infoC1 : RO.infoC1,
    },
    {
      title: enLang ? EN.infoT2 : RO.infoT2,
      content: enLang ? EN.infoC2 : RO.infoC2,
    },
    {
      title: enLang ? EN.infoT3 : RO.infoT3,
      content: enLang ? EN.infoC3 : RO.infoC3,
    },
    {
      title: enLang ? EN.infoT4 : RO.infoT4,
      content: enLang ? EN.infoC4 : RO.infoC4,
    },
    {
      title: enLang ? EN.infoT5 : RO.infoT5,
      content: enLang ? EN.infoC5 : RO.infoC5,
    },
    {
      title: enLang ? EN.infoT6 : RO.infoT6,
      content: enLang ? EN.infoC6 : RO.infoC6,
    },
  ];

  // Component mount
  useEffect(() => {
    // Get Username for display
    getCurrentUser();
  }, []);

  // Functions
  const toggleFontSize = async (size) => {
    dispatch(AppConfigActions.setCollItems([]));
    try {
      switch (size) {
        case 'S':
          await AsyncStorage.setItem('fontSizes', 'S');
          break;
        case 'M':
          await AsyncStorage.setItem('fontSizes', 'M');
          break;
        case 'L':
          await AsyncStorage.setItem('fontSizes', 'L');
          break;
        default:
          await AsyncStorage.setItem('fontSizes', 'M');
      }
      dispatch(AppConfigActions.setFonts());
    } catch (e) {
      crashlytics().log(`rightdrawer -> toggleFontSize(${size})`);
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
      crashlytics().log('rightdrawer -> getCurrentUser()');
      crashlytics().recordError(e);
    }
  };

  const openFilelist = async () => {
    const supported = await Linking.canOpenURL('https://filelist.io');
    if (supported) {
      Alert.alert(
        'Info',
        enLang ? EN.filelistWeb : RO.filelistWeb,
        [
          {
            text: enLang ? EN.yes : RO.yes,
            onPress: () => Linking.openURL('https://filelist.io'),
          },
          {
            text: enLang ? EN.no : RO.no,
            onPress: () => {},
            style: 'cancel',
          },
        ],
        {cancelable: true},
      );
    } else {
      Alert.alert(
        'Info',
        enLang ? EN.filelistWebErr : RO.filelistWebErr,
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
  };

  const switchTheme = async () => {
    dispatch(AppConfigActions.setCollItems([]));
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
      crashlytics().log('rightdrawer -> switchTheme()');
      crashlytics().recordError(e);
    }
  };

  const switchLang = async () => {
    dispatch(AppConfigActions.setCollItems([]));
    try {
      const currentLang = await AsyncStorage.getItem('enLang');
      if (currentLang !== null) {
        if (currentLang === 'false') {
          await AsyncStorage.setItem('enLang', 'true');
          dispatch(AppConfigActions.toggleEnLang());
          Animated.timing(roEn, {
            toValue: 0,
            duration: 1000,
            easing: Easing.bounce,
            useNativeDriver: true,
          }).start();
        } else {
          await AsyncStorage.setItem('enLang', 'false');
          dispatch(AppConfigActions.toggleEnLang());
          Animated.timing(roEn, {
            toValue: 1,
            duration: 1000,
            easing: Easing.bounce,
            useNativeDriver: true,
          }).start();
        }
      } else {
        await AsyncStorage.setItem('enLang', 'false');
      }
    } catch (e) {
      crashlytics().recordError(e);
      crashlytics().log('rightdrawer -> switchLang()');
    }
  };

  const handleLogout = async () => {
    const keys = ['username', 'passkey', 'latest'];
    navigation.closeDrawer();
    try {
      await AsyncStorage.multiRemove(keys);
      dispatch(AppConfigActions.latestError());
      dispatch(AppConfigActions.retrieveLatest());
    } catch (e) {
      crashlytics().recordError(e);
      crashlytics().log('rightdrawer -> handleLogout()');
    }
  };

  const _renderHeader = (section) => {
    return (
      <View>
        <Text
          style={{
            fontSize: Adjust(fontSizes !== null ? fontSizes[4] : 12),
            color: ACCENT_COLOR,
            fontWeight: 'bold',
          }}>
          {section.title}
        </Text>
      </View>
    );
  };

  const _renderContent = (section) => {
    return (
      <View style={RightDrawerStyle.renderContent}>
        <Text
          style={{
            color: lightTheme ? 'black' : 'white',
            fontSize: Adjust(fontSizes !== null ? fontSizes[4] : 12),
          }}>
          {section.content}
        </Text>
      </View>
    );
  };

  // eslint-disable-next-line no-shadow
  const _updateSections = (activeSections) => {
    setActiveSections(activeSections);
  };

  // Component render
  return (
    <>
      <Overlay
        statusBarTranslucent
        animationType="slide"
        overlayStyle={[
          RightDrawerStyle.infoOverlay,
          {
            backgroundColor: lightTheme ? MAIN_LIGHT : '#101010',
            paddingTop:
              Platform.OS === 'android' ? statusHeight : statusHeight * 2,
          },
        ]}
        isVisible={appInfo}
        onBackdropPress={() => {
          setActiveSections([]);
          dispatch(AppConfigActions.toggleAppInfo());
        }}>
        <View
          style={[
            RightDrawerStyle.infoOverlayCloseContainer,
            {backgroundColor: lightTheme ? MAIN_LIGHT : '#101010'},
          ]}>
          <ScrollView
            showsVerticalScrollIndicator={true}
            overScrollMode={'never'}
            bounces={false}
            contentContainerStyle={[
              RightDrawerStyle.infoOverlayScrollView,
              {
                backgroundColor: lightTheme ? MAIN_LIGHT : '#101010',
                paddingBottom:
                  Platform.OS === 'android' ? statusHeight : statusHeight * 1.5,
              },
            ]}>
            <View style={RightDrawerStyle.infoTitleContainer}>
              <Text
                style={{
                  fontSize: Adjust(fontSizes !== null ? fontSizes[6] : 14),
                  color: lightTheme ? 'black' : 'white',
                  fontWeight: 'bold',
                }}>
                {enLang ? EN.howToUse : RO.howToUse}
              </Text>
            </View>
            <Accordion
              sections={INFO}
              containerStyle={RightDrawerStyle.accordionContainer}
              expandMultiple
              underlayColor={lightTheme ? MAIN_LIGHT : '#303030'}
              activeSections={activeSections}
              renderHeader={_renderHeader}
              renderContent={_renderContent}
              onChange={_updateSections}
            />
            <View style={RightDrawerStyle.btnMainContainer}>
              <View style={RightDrawerStyle.btnContainer}>
                <Pressable
                  onPress={() => {
                    setActiveSections([]);
                    dispatch(AppConfigActions.toggleAppInfo());
                  }}
                  android_ripple={{
                    color: 'white',
                    borderless: false,
                  }}
                  style={RightDrawerStyle.btn}>
                  <FontAwesomeIcon size={20} color={'white'} icon={faCheck} />
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </View>
      </Overlay>
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
              {enLang ? EN.howToUse : RO.howToUse}
            </Text>
          </Pressable>
        </View>
        <View
          style={[
            RightDrawerStyle.settingsOverlayFont,
            {marginTop: statusHeight / 2.5},
          ]}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingHorizontal: statusHeight / 1.5,
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
              {enLang ? EN.textSize : RO.textSize}
            </Text>
          </View>
          {Platform.OS === 'android' ? (
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
              dropdownIconColor={lightTheme ? '#000000' : '#FFFFFF'}
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
                  ? toggleFontSize('S')
                  : itemValue === 'm'
                  ? toggleFontSize('M')
                  : itemValue === 'l'
                  ? toggleFontSize('L')
                  : null
              }>
              <Picker.Item label={enLang ? EN.s : RO.s} value="s" />
              <Picker.Item label={enLang ? EN.m : RO.m} value="m" />
              <Picker.Item label={enLang ? EN.l : RO.l} value="l" />
            </Picker>
          ) : (
            <PickerIOS
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
              style={RightDrawerStyle.settingsPickerIOS}
              itemStyle={{
                color: 'white',
                backgroundColor: lightTheme ? 'black' : 'transparent',
                height: statusHeight,
                width: width / 2,
                borderRadius: 10,
              }}
              onValueChange={(itemValue) =>
                itemValue === 's'
                  ? toggleFontSize('S')
                  : itemValue === 'm'
                  ? toggleFontSize('M')
                  : itemValue === 'l'
                  ? toggleFontSize('L')
                  : null
              }>
              <PickerIOS.Item label={enLang ? EN.s : RO.s} value="s" />
              <PickerIOS.Item label={enLang ? EN.m : RO.m} value="m" />
              <PickerIOS.Item label={enLang ? EN.l : RO.l} value="l" />
            </PickerIOS>
          )}
        </View>
        <View style={RightDrawerStyle.settingsOverlayContainer}>
          <Pressable
            style={RightDrawerStyle.settingsOverlayPressable}
            android_ripple={{
              color: 'grey',
              borderless: false,
            }}
            onPress={switchTheme}>
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
              {enLang ? EN.theme : RO.theme}
            </Text>
            <View
              style={{
                paddingLeft: statusHeight / 1.5,
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
        <View style={RightDrawerStyle.settingsOverlayContainer}>
          <Pressable
            style={RightDrawerStyle.settingsOverlayPressable}
            android_ripple={{
              color: 'grey',
              borderless: false,
            }}
            onPress={switchLang}>
            <Animated.View
              style={{
                width: 26,
                height: 26,
                transform: [
                  {
                    scale: bounceIt,
                  },
                ],
              }}>
              <FastImage
                style={{width: '100%', height: '100%'}}
                resizeMode={FastImage.resizeMode.contain}
                source={enLang ? en : ro}
              />
            </Animated.View>
            <Text
              style={{
                fontSize: Adjust(fontSizes !== null ? fontSizes[6] : 14),
                color: lightTheme ? 'black' : 'white',
                fontWeight: 'bold',
                marginLeft: statusHeight / 1.4,
              }}>
              {enLang ? EN.lang : RO.lang}
            </Text>
            <View
              style={{
                paddingLeft: statusHeight / 1.5,
                flexDirection: 'row',
                alignItems: 'center',
              }}
              pointerEvents={'none'}>
              <Switch
                trackColor={{
                  false: lightTheme ? 'black' : '#505050',
                  true: lightTheme ? 'black' : '#505050',
                }}
                thumbColor={lightTheme ? 'white' : MAIN_LIGHT}
                ios_backgroundColor="#909090"
                value={enLang}
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
            onPress={openFilelist}>
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
            onPress={handleLogout}>
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
    </>
  );
}

const RightDrawerStyle = EStyleSheet.create({
  profileContainer: {
    top: 0,
    width: '100%',
    height: width / 2,
    position: 'absolute',
    paddingTop: statusHeight * 2,
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
    paddingBottom: Platform.OS === 'ios' ? statusHeight / 3 : 0,
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
    paddingHorizontal: statusHeight / 1.5,
  },
  settingsOverlayText: {
    fontWeight: 'bold',
    marginLeft: statusHeight / 1.5,
  },
  settingsOverlayFont: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: statusHeight / 1.5,
  },
  settingsPicker: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    marginLeft: width / 6.65,
    marginTop: '1rem',
  },
  settingsPickerIOS: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '70%',
    marginLeft: width / 8.5,
    marginTop: '1.5rem',
    marginBottom: '1rem',
  },
  infoOverlay: {
    width: width,
    height: height + statusHeight,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
    padding: 5,
  },
  infoOverlayCloseContainer: {
    width: width,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoOverlayScrollView: {
    width: width,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  infoTitleContainer: {
    width: '100%',
    padding: '1rem',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  accordionContainer: {
    width: '100%',
    paddingHorizontal: '1rem',
  },
  renderContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: '1rem',
  },
  btnMainContainer: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContainer: {
    elevation: 2,
    zIndex: 2,
    width: width / 8,
    height: width / 8,
    borderRadius: width / 8 / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '2rem',
  },
  btn: {
    width: width / 8,
    height: width / 8,
    backgroundColor: ACCENT_COLOR,
    borderRadius: width / 8 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
